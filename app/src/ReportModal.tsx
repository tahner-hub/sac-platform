import { useEffect, useState } from "react";
import { C } from "./theme";
import { ICON } from "./icons";
import { REPORT_REASONS } from "./data";
import { useApp } from "./state";
import { useStore } from "./store";
import { Btn, IconTile, Modal, TextArea } from "./ui";

export function ReportModal() {
  const { reportOpen, reportTarget, reportKind, closeReport } = useApp();
  const { submitReport } = useStore();
  const reasons = REPORT_REASONS[reportKind];
  const [selected, setSelected] = useState(0);
  const [details, setDetails] = useState("");

  // Reset the form whenever a new report is opened.
  useEffect(() => {
    if (reportOpen) {
      setSelected(0);
      setDetails("");
    }
  }, [reportOpen, reportKind]);

  return (
    <Modal open={reportOpen} onClose={closeReport}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <IconTile path={ICON.flag} bg={C.redPale} color={C.red} size={44} radius={11} iconSize={22} strokeWidth={1.9} />
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Report {reportTarget}</h2>
          <p style={{ fontSize: 14, color: C.textMute, margin: "6px 0 0", lineHeight: 1.5 }}>
            Flag this for review by the S.A.C. trust &amp; safety team. Your report is confidential.
          </p>
        </div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, margin: "22px 0 10px" }}>Reason</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {reasons.map((label, i) => {
          const sel = i === selected;
          return (
            <div
              key={label}
              className="card card-click"
              onClick={() => setSelected(i)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                border: `1.5px solid ${sel ? C.green : C.line}`,
                borderRadius: 10,
                padding: "12px 14px",
                cursor: "pointer",
                background: sel ? C.greenWash : "#fff",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 99,
                  border: `2px solid ${sel ? C.green : C.chipLine}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: 99, background: sel ? C.green : "transparent" }} />
              </div>
              <span style={{ fontSize: 14, fontWeight: sel ? 700 : 500 }}>{label}</span>
            </div>
          );
        })}
      </div>
      <TextArea
        label="Details (optional)"
        value={details}
        onChange={setDetails}
        placeholder="Add any context that helps us investigate…"
        style={{ marginTop: 18 }}
      />
      <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
        <Btn variant="secondary" onClick={closeReport} style={{ flex: 1, padding: 13 }}>
          Cancel
        </Btn>
        <button
          className="btn"
          onClick={() => {
            submitReport(reportTarget, reasons[selected], details);
            closeReport();
          }}
          style={{
            flex: 1,
            fontSize: 14,
            fontWeight: 700,
            color: "#fff",
            background: C.red,
            border: "none",
            borderRadius: 9,
            padding: 13,
            cursor: "pointer",
          }}
        >
          Submit report
        </button>
      </div>
    </Modal>
  );
}
