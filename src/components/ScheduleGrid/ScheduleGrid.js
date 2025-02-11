import React, { useState } from 'react';
import { HotTable } from '@handsontable/react';

// Import the Handsontable module and CSS
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';
import './ScheduleGrid.css';

// Register the "date" cell type
Handsontable.cellTypes.registerCellType('date', {
    renderer: Handsontable.renderers.DateRenderer,
    editor: Handsontable.editors.DateEditor,
    validator: Handsontable.validators.DateValidator
});

function ScheduleGrid() {
  // Sample flight schedule data
  const [data, setData] = useState([
    { flightNo: 'FL123', date: '2025-03-01', departure: '09:00', arrival: '12:00', pilot: 'John Doe', remarks: 'Training flight' },
    { flightNo: 'FL456', date: '2025-03-02', departure: '14:00', arrival: '17:00', pilot: 'Jane Smith', remarks: 'Cargo flight' },
  ]);

  // Define columns for the schedule
  const columns = [
    { data: 'flightNo', type: 'text', title: 'Flight No.' },
    { data: 'date', type: 'date', dateFormat: 'YYYY-MM-DD', correctFormat: true, title: 'Date' },
    { data: 'departure', type: 'time', timeFormat: 'HH:mm', title: 'Departure Time' },
    { data: 'arrival', type: 'time', timeFormat: 'HH:mm', title: 'Arrival Time' },
    { data: 'pilot', type: 'text', title: 'Pilot' },
    { data: 'remarks', type: 'text', title: 'Remarks' },
  ];

  // Handsontable settings
  const hotSettings = {
    data: data,
    colHeaders: columns.map(col => col.title),
    rowHeaders: true,
    columns: columns,
    contextMenu: true,          // Right-click menu for inserting/deleting rows/columns
    mergeCells: true,           // Allow merging cells
    manualColumnResize: true,   // Enable column resizing
    manualRowResize: true,      // Enable row resizing
    licenseKey: 'non-commercial-and-evaluation', // For non-commercial use
    afterChange: (changes, source) => {
      if (source !== 'loadData' && changes) {
        // Update local state – adjust if you wish to persist changes to the backend
        setData([...data]);
      }
    }
  };

  return (
    <div className="schedule-grid-container">
      <h2>Flight Schedule</h2>
      <HotTable settings={hotSettings} />
    </div>
  );
}

export default ScheduleGrid;
