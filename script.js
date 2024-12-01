document.getElementById('fileInput').addEventListener('change', handleFileUpload);
document.getElementById('downloadBtn').addEventListener('click', downloadExcel);

let tableData = [];

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonData = JSON.parse(e.target.result);
                displayTable(jsonData);
            } catch (err) {
                console.error('File read error:', err);
                alert('Invalid JSON file');
            }
        };
        reader.readAsText(file);
    }
}

function displayTable(data) {
    tableData = [];

    data.forEach(item => {
        if (Array.isArray(item.messages)) {
            item.messages.forEach(message => {
                tableData.push({
                    id: item.id,
                    source: item.source,
                    sessionId: item.sessionId,
                    memoryType: item.memoryType,
                    email: item.email,
                    role: message.role,
                    content: message.content,
                    time: message.time,
                    feedback: ''
                });
            });
        }
    });

    const table = document.getElementById('dataTable');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    thead.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Source</th>
            <th>Session ID</th>
            <th>Memory Type</th>
            <th>Email</th>
            <th>Role</th>
            <th>Content</th>
            <th>Time</th>
            <th>Feedback</th>
        </tr>
    `;
    
    tbody.innerHTML = tableData.map((row, rowIndex) => `
        <tr>
            <td>${row.id}</td>
            <td>${row.source}</td>
            <td>${row.sessionId}</td>
            <td>${row.memoryType}</td>
            <td>${row.email}</td>
            <td>${row.role}</td>
            <td>${row.content}</td>
            <td>${row.time}</td>
            <td>
                <input type="text" 
                       oninput="updateFeedback(${rowIndex}, this.value)" 
                       placeholder="Enter notes">
            </td>
        </tr>
    `).join('');
}

function updateFeedback(rowIndex, value) {
    tableData[rowIndex].feedback = value;
}

function downloadExcel() {
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, 'updated_data.xlsx');
}
