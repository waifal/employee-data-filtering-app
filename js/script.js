function loadEmployees(componentName, targetId = "app") {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.status === 200) {
            const responseText = JSON.parse(xhr.responseText);
            const employeeData = responseText.employee || [];

            // DOM Queries
            const searchEmployee = document.getElementById("search-employee");
            const selectEmploymentType = document.getElementById("employment-type");
            const minRate = document.getElementById("min-rate");
            const maxRate = document.getElementById("max-rate");

            function getEmploymentTypes(data) {
                return data
                    .map((item) =>
                        Object.entries(item)
                            .filter(([key, value]) => value === true)
                            .map(([key]) => key)
                    )
                    .flat();
            }

            function loadTable(data) {
                let content = "";

                data.forEach((employee) => {
                    content += `
                        <tr>
                            <td data-employee-name="${employee.name}">${employee.name}</td>
                            <td>${employee.position}</td>
                            <td>${employee.rate.toFixed(2)}</td>
                            <td>${getEmploymentTypes(employee.employment)}</td>
                        </tr>
                    `;
                });

                document.getElementById(targetId).innerHTML = content;
            }

            function filterEmployees(data) {
                const searchValue = searchEmployee.value.toLowerCase().trim();
                const min = parseFloat(minRate.value) || 0;
                const max = parseFloat(maxRate.value) || Number.MAX_VALUE;
                const selectedEmploymentType = selectEmploymentType.value;

                const filteredEmployees = data.filter((employee) => {
                    const name = employee.name.toLowerCase().includes(searchValue);
                    const position = employee.position.toLowerCase().includes(searchValue);
                    const rate = employee.rate >= min && employee.rate <= max;
                    const type = selectedEmploymentType === "all" || getEmploymentTypes(employee.employment).includes(selectedEmploymentType);

                    return (name || position) && rate && type;
                });

                if (filteredEmployees.length > 0 || selectedEmploymentType === "all") {
                    loadTable(filteredEmployees.length > 0 ? filteredEmployees : data);
                } else {
                    document.getElementById("employee-data").innerHTML = "<tr><td colspan='4'>No employees match the criteria</td></tr>";
                }
            }

            loadTable(employeeData);

            // Event Listeners
            searchEmployee.addEventListener("input", () => filterEmployees(employeeData));
            minRate.addEventListener("input", () => filterEmployees(employeeData));
            maxRate.addEventListener("input", () => filterEmployees(employeeData));
            selectEmploymentType.addEventListener("change", () => filterEmployees(employeeData));

            document.getElementsByTagName("button")[0].onclick = function () {
                loadTable(employeeData);
            };
        }
    };

    // prettier-ignore
    xhr.onerror = function () {
        document.getElementById("employee-data").innerHTML = `<tr><td colspan="4" style="color: #ff0000">Error fetching component.</td></tr>`;
    };

    xhr.open("GET", `../components/${componentName}.json`, true);
    xhr.send(null);
}

loadEmployees("employee", "employee-data");
