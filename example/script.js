fetch("http://localhost:8080/api/categories")
    .then((response) => response.json())
    .then((data) => {

        const labelNode = document.createElement("label");
        labelNode.textContent = "Categories";
        labelNode.htmlFor = "select-category";

        const selectNode = document.createElement("select");
        selectNode.id = "select-category";

        const createButton = document.createElement("button");
        createButton.id = "createBut";
        createButton.textContent = "Create";

        data.forEach((category) => {

            const optionNode = document.createElement("option");
            optionNode.textContent = category.name;
            selectNode.appendChild(optionNode);

        });

        labelNode.appendChild(selectNode);
        labelNode.appendChild(createButton);

        createButton.addEventListener("click", () => {
            const existingCreateDiv = document.getElementById("createDiv");
            if (existingCreateDiv) {
                existingCreateDiv.remove();
            }

            const nameInput = document.createElement("input");
            nameInput.type = "text";
            nameInput.placeholder = "Product Name";

            const priceInput = document.createElement("input");
            priceInput.type = "text";
            priceInput.placeholder = "Product Price";

            const selectNodeForCreatingProduct = document.createElement("select");
            selectNodeForCreatingProduct.id = "select-category-for-creating-product";

            data.forEach((category) => {
                const optionNode = document.createElement("option");
                optionNode.textContent = category.name;
                optionNode.value = category.id;
                selectNodeForCreatingProduct.appendChild(optionNode);
            });


            const addButton = document.createElement("button");
            addButton.textContent = "Add";
            addButton.id = "addBut"
            addButton.addEventListener("click", () => {
                const productName = nameInput.value;
                const productPrice = priceInput.value;

                const selectNodeCurrentForCreatingProduct = document.getElementById("select-category-for-creating-product");
                let selectCategoryIdForCreatingProduct;

                // console.log(selectNodeCurrentForCreatingProduct);

                selectNodeCurrentForCreatingProduct.addEventListener("change", () => {
                    const selectedOption = selectNodeCurrentForCreatingProduct.options[selectNodeCurrentForCreatingProduct.selectedIndex];
                    selectCategoryIdForCreatingProduct = selectedOption.value;
                    console.log("Selected category : ", selectCategoryIdForCreatingProduct);
                    // });

                    console.log(selectCategoryIdForCreatingProduct);

                    // Create a new ProductDTO object with the collected values
                    const newProduct = {
                        name: productName,
                        price: productPrice,
                        categoryId: selectCategoryIdForCreatingProduct
                    };

                    console.log(newProduct);

                    console.log(JSON.stringify(newProduct));

                    // Send a request to the server to create the product
                    fetch("http://localhost:8080/api/product", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(newProduct)
                    })
                        .then(response => response.json())
                        .then(data => {
                            const inputNode = document.getElementById("createDiv");
                            inputNode.remove();
                        })
                        .catch(error => {
                            console.log("Error creating product:", error);
                            // Handle any errors that occur during the request
                        });
                });
            });

            const createDiv = document.createElement("div");
            createDiv.id = "createDiv"; // Add an ID to the createDiv for easier removal
            createDiv.appendChild(nameInput);
            createDiv.appendChild(priceInput);
            createDiv.appendChild(selectNodeForCreatingProduct);
            createDiv.appendChild(addButton);

            const parentElement = document.querySelector(".create-main");
            parentElement.appendChild(createDiv);
        });


        const parentElement = document.querySelector(".select-class");
        parentElement.appendChild(labelNode);

        const selectNodeCurrent = document.getElementById("select-category");
        let selectCategory;


        selectNodeCurrent.addEventListener("change", () => {
            const selectedOption = selectNodeCurrent.options[selectNodeCurrent.selectedIndex];
            selectCategory = selectedOption.textContent;
            console.log("Selected category:", selectCategory);

            const existingTable = document.getElementById("productTable");
            if (existingTable) {
                existingTable.remove(); // Remove the existing table if it exists
            }

            fetch(`http://localhost:8080/api/product-by-category?category=${selectCategory}`)
                .then((response) => response.json())
                .then((data) => {

                    const productList = document.createElement("div");
                    productList.id = "productList";

                    const table = document.createElement("table");

                    table.id = "productTable";

                    const thead = document.createElement("thead");
                    const headerRow = document.createElement("tr");
                    const nameHeader = document.createElement("th");
                    const priceHeader = document.createElement("th");

                    nameHeader.textContent = "Name";
                    priceHeader.textContent = "Price";

                    headerRow.appendChild(nameHeader);
                    headerRow.appendChild(priceHeader);
                    thead.appendChild(headerRow);
                    table.appendChild(thead);

                    const tbody = document.createElement("tbody");


                    data.forEach((product) => {
                        const row = document.createElement("tr");
                        const nameCell = document.createElement("td");
                        const priceCell = document.createElement("td");
                        const deleteButton = document.createElement("button");
                        deleteButton.id = "deleteBut";
                        const updateButton = document.createElement("button");
                        updateButton.id = "updateBut";

                        nameCell.textContent = product.name;
                        priceCell.textContent = product.price;
                        deleteButton.textContent = "Delete";
                        updateButton.textContent = "Update";

                        // Add event listeners for the delete and update buttons
                        deleteButton.addEventListener("click", () => {
                            // Handle delete button click
                            console.log("Delete button clicked for product:", product.name);
                        });

                        updateButton.addEventListener("click", () => {
                            // Handle update button click
                            console.log("Update button clicked for product:", product.name);
                        });

                        row.appendChild(nameCell);
                        row.appendChild(priceCell);
                        row.appendChild(deleteButton);
                        row.appendChild(updateButton);

                        tbody.appendChild(row);
                    });


                    table.appendChild(tbody);
                    productList.appendChild(table);


                    const parentElement = document.querySelector(".create-main");
                    parentElement.appendChild(productList);
                })
                .catch((err) => {
                    console.log("ERROR", err);
                });

        });

    })
    .catch((err) => {
        console.log("ERROR", err);
    });

