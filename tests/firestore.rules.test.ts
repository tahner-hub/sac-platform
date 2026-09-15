import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";

/**
 * Security-rules tests for firestore.rules.
 *
 * Rules are the one part of this system where a mistake is silent: the app
 * keeps working and the data is simply exposed. So every rule gets both an
 * allow case and a deny case — a test suite that only proves the happy path
 * would pass just as well against `allow read, write: if true`.
 *
 * Run with: npm test (from the repo root), which starts the emulator first.
 */

let env: RulesTestEnvironment;

// Profiles are seeded with admin privileges so the tests can set up state that
// the rules would (correctly) refuse to let a client create.
const USERS = {
  donor: { role: "donor", status: "active", verified: true, reportCount: 0 },
  donor2: { role: "donor", status: "active", verified: true, reportCount: 0 },
  orgVerified: { role: "org", status: "active", verified: true, reportCount: 0 },
  orgUnverified: { role: "org", status: "active", verified: false, reportCount: 0 },
  individual: { role: "individual", status: "active", verified: true, reportCount: 0 },
  driver: { role: "driver", status: "active", verified: true, reportCount: 0 },
  driver2: { role: "driver", status: "active", verified: true, reportCount: 0 },
  admin: { role: "admin", status: "active", verified: true, reportCount: 0 },
  suspended: { role: "donor", status: "suspended", verified: true, reportCount: 3 },
} as const;

type Uid = keyof typeof USERS;

const as = (uid: Uid) => env.authenticatedContext(uid).firestore();
const guest = () => env.unauthenticatedContext().firestore();

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: "sac-rules-test",
    firestore: {
      rules: readFileSync("../firestore.rules", "utf8"),
      host: "127.0.0.1",
      port: 8080,
    },
  });
});

afterAll(async () => env?.cleanup());

beforeEach(async () => {
  await env.clearFirestore();
  // Seed profiles and fixtures with rules bypassed.
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    for (const [uid, profile] of Object.entries(USERS)) {
      await setDoc(doc(db, "users", uid), { ...profile, email: `${uid}@example.com` });
    }
    await setDoc(doc(db, "listings", "pub1"), { donorUid: "donor", visibility: "public", title: "Public pallet" });
    await setDoc(doc(db, "listings", "org1"), { donorUid: "donor", visibility: "org", title: "Priority pallet" });
    await setDoc(doc(db, "needs", "need1"), { orgUid: "orgVerified", item: "Coats", needed: 100, received: 60 });
    await setDoc(doc(db, "orders", "order1"), {
      recipientUid: "orgVerified", donorUid: "donor", driverUid: "driver", status: "reserved",
    });
    await setDoc(doc(db, "deliveries", "openRun"), {
      status: "open", donorUid: "donor", recipientUid: "orgVerified", driverUid: null,
    });
    await setDoc(doc(db, "deliveries", "myRun"), {
      status: "accepted", donorUid: "donor", recipientUid: "orgVerified", driverUid: "driver",
    });
    await setDoc(doc(db, "threads", "t1"), { memberUids: ["donor", "orgVerified"], lastMessage: "hi" });
    await setDoc(doc(db, "threads", "t1", "messages", "m1"), { senderUid: "donor", text: "hi" });
    await setDoc(doc(db, "reports", "r1"), { reporterUid: "individual", status: "open", subjectUid: "donor" });
  });
});

/* ================================ USERS ================================ */

describe("users", () => {
  it("lets a user read their own profile", async () => {
    await assertSucceeds(getDoc(doc(as("donor"), "users", "donor")));
  });

  it("stops a user reading someone else's profile", async () => {
    await assertFails(getDoc(doc(as("donor"), "users", "orgVerified")));
  });

  it("lets an admin read any profile", async () => {
    await assertSucceeds(getDoc(doc(as("admin"), "users", "donor")));
  });

  it("stops a guest reading any profile", async () => {
    await assertFails(getDoc(doc(guest(), "users", "donor")));
  });

  it("lets a user edit their own phone", async () => {
    await assertSucceeds(updateDoc(doc(as("donor"), "users", "donor"), { phone: "555-0100" }));
  });

  // The privilege-escalation cases. These are the point of the whole file.
  it("stops a user promoting themselves to admin", async () => {
    await assertFails(updateDoc(doc(as("donor"), "users", "donor"), { role: "admin" }));
  });

  it("stops a user verifying themselves", async () => {
    await assertFails(updateDoc(doc(as("orgUnverified"), "users", "orgUnverified"), { verified: true }));
  });

  it("stops a user clearing their own report count", async () => {
    await assertFails(updateDoc(doc(as("suspended"), "users", "suspended"), { reportCount: 0 }));
  });

  it("stops a user un-suspending themselves", async () => {
    await assertFails(updateDoc(doc(as("suspended"), "users", "suspended"), { status: "active" }));
  });

  it("lets an admin verify someone", async () => {
    await assertSucceeds(updateDoc(doc(as("admin"), "users", "orgUnverified"), { verified: true }));
  });

  it("stops sign-up creating a pre-verified profile", async () => {
    await assertFails(
      setDoc(doc(as("individual"), "users", "individual"), {
        role: "admin", verified: true, status: "active", reportCount: 0,
      }),
    );
  });

  it("stops deleting another user", async () => {
    await assertFails(deleteDoc(doc(as("donor"), "users", "orgVerified")));
  });
});

/* =============================== LISTINGS =============================== */

describe("listings", () => {
  it("lets any signed-in user read a public listing", async () => {
    await assertSucceeds(getDoc(doc(as("individual"), "listings", "pub1")));
  });

  it("stops a guest reading listings", async () => {
    await assertFails(getDoc(doc(guest(), "listings", "pub1")));
  });

  it("lets a verified org read an org-priority listing", async () => {
    await assertSucceeds(getDoc(doc(as("orgVerified"), "listings", "org1")));
  });

  it("stops an UNVERIFIED org reading an org-priority listing", async () => {
    await assertFails(getDoc(doc(as("orgUnverified"), "listings", "org1")));
  });

  it("stops an individual reading an org-priority listing", async () => {
    await assertFails(getDoc(doc(as("individual"), "listings", "org1")));
  });

  it("lets the owning donor read their own org-priority listing", async () => {
    await assertSucceeds(getDoc(doc(as("donor"), "listings", "org1")));
  });

  it("lets a donor create their own listing", async () => {
    await assertSucceeds(
      setDoc(doc(as("donor"), "listings", "new1"), { donorUid: "donor", visibility: "public" }),
    );
  });

  it("stops a donor creating a listing under another donor's id", async () => {
    await assertFails(
      setDoc(doc(as("donor"), "listings", "new2"), { donorUid: "donor2", visibility: "public" }),
    );
  });

  it("stops an org creating a listing", async () => {
    await assertFails(
      setDoc(doc(as("orgVerified"), "listings", "new3"), { donorUid: "orgVerified", visibility: "public" }),
    );
  });

  it("stops a suspended donor creating a listing", async () => {
    await assertFails(
      setDoc(doc(as("suspended"), "listings", "new4"), { donorUid: "suspended", visibility: "public" }),
    );
  });

  it("stops one donor editing another's listing", async () => {
    await assertFails(updateDoc(doc(as("donor2"), "listings", "pub1"), { title: "hijacked" }));
  });
});

/* ================================ NEEDS ================================= */

describe("needs", () => {
  it("lets any signed-in user read a community request", async () => {
    await assertSucceeds(getDoc(doc(as("donor"), "needs", "need1")));
  });

  it("lets the owning org edit its request", async () => {
    await assertSucceeds(updateDoc(doc(as("orgVerified"), "needs", "need1"), { item: "Winter coats", received: 60 }));
  });

  it("stops the org inflating its own received count", async () => {
    await assertFails(updateDoc(doc(as("orgVerified"), "needs", "need1"), { received: 100 }));
  });

  it("stops another org editing the request", async () => {
    await assertFails(updateDoc(doc(as("orgUnverified"), "needs", "need1"), { item: "hijacked" }));
  });

  it("stops a request being created already part-filled", async () => {
    await assertFails(
      setDoc(doc(as("orgVerified"), "needs", "need2"), { orgUid: "orgVerified", needed: 10, received: 5 }),
    );
  });

  it("lets a donor contribute", async () => {
    await assertSucceeds(
      setDoc(doc(as("donor"), "needs", "need1", "contributions", "c1"), { donorUid: "donor", quantity: 5 }),
    );
  });

  it("stops a donor contributing under someone else's name", async () => {
    await assertFails(
      setDoc(doc(as("donor"), "needs", "need1", "contributions", "c2"), { donorUid: "donor2", quantity: 5 }),
    );
  });
});

/* ================================ ORDERS ================================ */

describe("orders", () => {
  it("lets the recipient read their order", async () => {
    await assertSucceeds(getDoc(doc(as("orgVerified"), "orders", "order1")));
  });

  it("lets the donor read an order against their listing", async () => {
    await assertSucceeds(getDoc(doc(as("donor"), "orders", "order1")));
  });

  it("stops an unrelated user reading an order", async () => {
    await assertFails(getDoc(doc(as("individual"), "orders", "order1")));
  });

  // The money case: a client must never be able to mark itself paid.
  it("stops a client creating an order already marked paid", async () => {
    await assertFails(
      setDoc(doc(as("individual"), "orders", "o2"), { recipientUid: "individual", status: "paid" }),
    );
  });

  it("stops the recipient flipping an order to paid", async () => {
    await assertFails(updateDoc(doc(as("orgVerified"), "orders", "order1"), { status: "paid" }));
  });

  it("lets the recipient amend an order without touching status", async () => {
    await assertSucceeds(
      updateDoc(doc(as("orgVerified"), "orders", "order1"), { status: "reserved", notes: "back door" }),
    );
  });
});

/* ============================== DELIVERIES ============================== */

describe("deliveries", () => {
  it("lets a driver see an open run", async () => {
    await assertSucceeds(getDoc(doc(as("driver2"), "deliveries", "openRun")));
  });

  it("stops a non-driver browsing open runs", async () => {
    await assertFails(getDoc(doc(as("individual"), "deliveries", "openRun")));
  });

  it("lets a driver claim an open run for themselves", async () => {
    await assertSucceeds(
      updateDoc(doc(as("driver2"), "deliveries", "openRun"), { driverUid: "driver2", status: "accepted" }),
    );
  });

  it("stops a driver assigning an open run to someone else", async () => {
    await assertFails(
      updateDoc(doc(as("driver2"), "deliveries", "openRun"), { driverUid: "driver", status: "accepted" }),
    );
  });

  it("stops a driver touching a run assigned to another driver", async () => {
    await assertFails(updateDoc(doc(as("driver2"), "deliveries", "myRun"), { status: "delivered" }));
  });

  it("lets the assigned driver complete their run", async () => {
    await assertSucceeds(updateDoc(doc(as("driver"), "deliveries", "myRun"), { status: "delivered" }));
  });

  it("stops a client creating a delivery", async () => {
    await assertFails(setDoc(doc(as("driver"), "deliveries", "d9"), { status: "open", driverUid: "driver" }));
  });
});

/* ============================== MESSAGING =============================== */

describe("threads", () => {
  it("lets a member read the thread", async () => {
    await assertSucceeds(getDoc(doc(as("donor"), "threads", "t1")));
  });

  // Highest-severity privacy case in the app.
  it("stops a non-member reading the thread", async () => {
    await assertFails(getDoc(doc(as("individual"), "threads", "t1")));
  });

  it("stops a non-member reading the messages", async () => {
    await assertFails(getDocs(collection(as("individual"), "threads", "t1", "messages")));
  });

  it("lets a member read the messages", async () => {
    await assertSucceeds(getDocs(collection(as("donor"), "threads", "t1", "messages")));
  });

  it("lets a member post as themselves", async () => {
    await assertSucceeds(
      setDoc(doc(as("donor"), "threads", "t1", "messages", "m2"), { senderUid: "donor", text: "hello" }),
    );
  });

  it("stops a member posting under another member's name", async () => {
    await assertFails(
      setDoc(doc(as("donor"), "threads", "t1", "messages", "m3"), { senderUid: "orgVerified", text: "forged" }),
    );
  });

  it("stops a non-member posting into the thread", async () => {
    await assertFails(
      setDoc(doc(as("individual"), "threads", "t1", "messages", "m4"), { senderUid: "individual", text: "intruder" }),
    );
  });

  it("stops anyone editing a sent message", async () => {
    await assertFails(updateDoc(doc(as("donor"), "threads", "t1", "messages", "m1"), { text: "rewritten" }));
  });

  it("stops creating a thread you are not a member of", async () => {
    await assertFails(
      setDoc(doc(as("individual"), "threads", "t2"), { memberUids: ["donor", "orgVerified"] }),
    );
  });
});

/* =============================== REPORTS ================================ */

describe("reports", () => {
  it("lets an active user file a report", async () => {
    await assertSucceeds(
      setDoc(doc(as("donor"), "reports", "r2"), { reporterUid: "donor", status: "open", subjectUid: "driver" }),
    );
  });

  it("stops a report being filed under someone else's name", async () => {
    await assertFails(
      setDoc(doc(as("donor"), "reports", "r3"), { reporterUid: "individual", status: "open" }),
    );
  });

  it("stops a report being filed pre-resolved", async () => {
    await assertFails(
      setDoc(doc(as("donor"), "reports", "r4"), { reporterUid: "donor", status: "resolved" }),
    );
  });

  it("stops the reporter reading their own report back", async () => {
    await assertFails(getDoc(doc(as("individual"), "reports", "r1")));
  });

  it("stops the subject reading reports about them", async () => {
    await assertFails(getDoc(doc(as("donor"), "reports", "r1")));
  });

  it("lets an admin read and resolve", async () => {
    await assertSucceeds(getDoc(doc(as("admin"), "reports", "r1")));
    await assertSucceeds(updateDoc(doc(as("admin"), "reports", "r1"), { status: "resolved" }));
  });

  it("stops anyone deleting a report", async () => {
    await assertFails(deleteDoc(doc(as("admin"), "reports", "r1")));
  });
});

/* ========================= CATCH-ALL / UNKNOWN ========================== */

describe("unknown collections", () => {
  it("denies reads on a collection the rules never mention", async () => {
    await assertFails(getDoc(doc(as("admin"), "secrets", "s1")));
  });

  it("denies writes on a collection the rules never mention", async () => {
    await assertFails(setDoc(doc(as("admin"), "secrets", "s1"), { x: 1 }));
  });
});
