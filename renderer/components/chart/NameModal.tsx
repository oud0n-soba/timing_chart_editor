export const NameModal = ({
  nameData,
  setNameData,
  signalType,
  setSignalType,
  chartData,
  setChartData,
  setIsNameModalOpen,
  editingIndex,
  setEditingIndex,
  editingNameValue,
  setNameEditingValue,
  editingSignalTypeValue,
  setEditingSignalTypeValue,
}) => {
  //   const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const saveNameEdit = () => {
    if (editingIndex !== null) {
      const newNameData = [...nameData];
      const newSignalTypeData = [...signalType];
      newNameData[editingIndex] = editingNameValue;
      newSignalTypeData[editingIndex] = editingSignalTypeValue;
      setNameData(newNameData);
      setSignalType(newSignalTypeData);
      setIsNameModalOpen(false);
      setEditingIndex(null);
    }
  };

  const deleteSignal = () => {
    if (editingIndex !== null) {
      const newNameData = [...nameData];
      const newSignalTypeData = [...signalType];
      const newChartData = [...chartData];
      newNameData.splice(editingIndex, 1);
      newSignalTypeData.splice(editingIndex, 1);
      newChartData.splice(editingIndex, 1);
      setNameData(newNameData);
      setSignalType(newSignalTypeData);
      setChartData(newChartData);
      setIsNameModalOpen(false);
      setEditingIndex(null);
    }
  };

  const addNewSignal = () => {
    const newNameData = [...nameData];
    const newSignalTypeData = [...signalType];
    const newChartData = [...chartData];
    newNameData.push("NEW_DATA");
    newSignalTypeData.push("data");
    newChartData.push([0]);
    setNameData(newNameData);
    setSignalType(newSignalTypeData);
    setChartData(newChartData);
    setIsNameModalOpen(false);
    setEditingIndex(null);
  };

  const moveSignalUp = () => {
    if (editingIndex !== null && editingIndex > 0) {
      const newNameData = [...nameData];
      const newSignalTypeData = [...signalType];
      const newChartData = [...chartData];

      // Swap with index - 1
      [newNameData[editingIndex], newNameData[editingIndex - 1]] = [
        newNameData[editingIndex - 1],
        newNameData[editingIndex],
      ];
      [newSignalTypeData[editingIndex], newSignalTypeData[editingIndex - 1]] = [
        newSignalTypeData[editingIndex - 1],
        newSignalTypeData[editingIndex],
      ];
      [newChartData[editingIndex], newChartData[editingIndex - 1]] = [
        newChartData[editingIndex - 1],
        newChartData[editingIndex],
      ];

      setNameData(newNameData);
      setSignalType(newSignalTypeData);
      setChartData(newChartData);
      setEditingIndex(editingIndex - 1);
    }
  };

  const moveSignalDown = () => {
    if (editingIndex !== null && editingIndex < nameData.length - 1) {
      const newNameData = [...nameData];
      const newSignalTypeData = [...signalType];
      const newChartData = [...chartData];

      // Swap with index + 1
      [newNameData[editingIndex], newNameData[editingIndex + 1]] = [
        newNameData[editingIndex + 1],
        newNameData[editingIndex],
      ];
      [newSignalTypeData[editingIndex], newSignalTypeData[editingIndex + 1]] = [
        newSignalTypeData[editingIndex + 1],
        newSignalTypeData[editingIndex],
      ];
      [newChartData[editingIndex], newChartData[editingIndex + 1]] = [
        newChartData[editingIndex + 1],
        newChartData[editingIndex],
      ];

      setNameData(newNameData);
      setSignalType(newSignalTypeData);
      setChartData(newChartData);
      setEditingIndex(editingIndex + 1);
    }
  };

  const cancelNameEdit = () => {
    setIsNameModalOpen(false);
    setEditingIndex(null);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          minWidth: "300px",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Edit Signal Name</h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginRight: "8px",
            }}
          >
            <button
              onClick={moveSignalUp}
              disabled={editingIndex === 0}
              style={{
                marginBottom: "2px",
                cursor: "pointer",
                padding: "2px 6px",
              }}
            >
              ▲
            </button>
            <button
              onClick={moveSignalDown}
              disabled={editingIndex === nameData.length - 1}
              style={{ cursor: "pointer", padding: "2px 6px" }}
            >
              ▼
            </button>
          </div>
          <input
            type="text"
            value={editingNameValue}
            onChange={(e) => setNameEditingValue(e.target.value)}
            style={{
              flexGrow: 1,
              padding: "8px",
              boxSizing: "border-box",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
            autoFocus
          />
        </div>

        <h3 style={{ marginTop: 0 }}>Edit Signal Type</h3>
        <select
          value={editingSignalTypeValue}
          onChange={(e) =>
            setEditingSignalTypeValue(e.target.value as SignalType)
          }
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "14px",
            boxSizing: "border-box",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          <option value="data">Data</option>
          <option value="clock">Clock</option>
        </select>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
          }}
        >
          <button
            onClick={deleteSignal}
            style={{
              padding: "8px 14px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "#ff0051ff",
              color: "white",
              cursor: "pointer",
            }}
          >
            Delete Signal
          </button>
          <button
            onClick={cancelNameEdit}
            style={{
              padding: "8px 14px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={saveNameEdit}
            style={{
              padding: "8px 14px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "#007bff",
              color: "white",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
