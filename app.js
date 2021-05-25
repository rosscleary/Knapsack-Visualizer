let items = [];

let itemTable = document.getElementById('itemsTable');

itemTable.innerHTML = 
`
<tr>
    <th>Type</th>
    <th>Name</th>
    <th>Price</th>
    <th>Value</th>
</tr>
`;

const renderTable = function() {
    itemTable.innerHTML = 
    `
    <tr>
        <th>Type</th>
        <th>Name</th>
        <th>Price</th>
        <th>Value</th>
    </tr>
    `;

    items.sort(function (a, b) {
        const aType = a.itemType.toLowerCase();
        const bType = b.itemType.toLowerCase();

        if(aType === bType) {
            return 0;
        }
        if(aType < bType) {
            return -1;
        }
        return 1;
    });

    for(let item of items) {
        let row = itemTable.insertRow();
        let type = row.insertCell(0);
        let name = row.insertCell(1);
        let price = row.insertCell(2);
        let value = row.insertCell(3);
        type.innerHTML = item.itemType;
        name.innerHTML = item.itemName;
        price.innerHTML = item.itemPrice;
        value.innerHTML = item.itemValue;
    }

}

document.querySelector('#addItemForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let type = e.target.elements.itemType.value;
    let name = e.target.elements.itemName.value;
    let price = e.target.elements.itemPrice.value;
    let value = e.target.elements.itemValue.value;

    items.push({
        itemType: type,
        itemName: name,
        itemPrice: price,
        itemValue: value
    });

    renderTable();
});

let budget;

let dpTable = document.getElementById('dpTable');

let dp = [[]];
let dpNext = [[]];

const displayRows = function(typeIndex, budgetLeft) {
    itemTable.style.backgroundColor = 'red';
    for(; typeIndex > 0; typeIndex--) {
        itemTableRows = document.getElementById('itemsTable').getElementsByTagName('tr')
        let itemTake = dpNext[typeIndex][budgetLeft];
        itemTableRows[itemTake + 1].style.backgroundColor = 'yellow';
        budgetLeft -= items[itemTake].itemPrice;
    }
}

const runAlgorithm = function() {
    let row = dpTable.insertRow(-1);
    row.insertCell(-1);
    for(let budgetLeft = 0; budgetLeft <= budget; budgetLeft++) {
        let budgetLeftCell = row.insertCell(-1);
        budgetLeftCell.innerHTML = budgetLeft;
    }

    dp[0] = [];
    dpNext[0] = [];
    for(let budgetLeft = 0; budgetLeft <= budget; budgetLeft++) {
        dp[0][budgetLeft] = 0;
        dpNext[0][budgetLeft] = 0;
    }

    items.push({
        itemType: 'ZZZZZZZZZZ',
        itemName: 'ZZZZZZZZZZ',
        itemPrice: 'ZZZZZZZZZZ',
        itemValue: 'ZZZZZZZZZZ'
    });

    let last = 0;
    let typeCount = 0;
    for(let i = 0; i < items.length; i++) {
        if(i == 0 || items[i].itemType == items[i - 1].itemType) {
            continue;
        }

        typeCount++;
        let row = dpTable.insertRow();
        let typeCell = row.insertCell(-1);
        typeCell.innerHTML = items[last].itemType;

        dp[typeCount] = [];
        dpNext[typeCount] = [];

        for(let budgetLeft = 0; budgetLeft <= budget; budgetLeft++) {

            dp[typeCount][budgetLeft] = -1000000000;

            for(let j = last; j < i; j++) {
                let budgetRemain = budgetLeft - items[j].itemPrice;
                if(budgetRemain < 0) {
                    continue;
                }
                
                let option = Number(items[j].itemValue) + Number(dp[typeCount - 1][budgetRemain]);
                if(Number(dp[typeCount - 1][budgetRemain]) == -1000000000) {
                    option = -1000000000;
                }

                if(option > 0 && option > dp[typeCount][budgetLeft]) {
                    dp[typeCount][budgetLeft] = option;
                    dpNext[typeCount][budgetLeft] = j;
                }
            }

            let dpCell = row.insertCell(-1);
            dpCell.innerHTML = dp[typeCount][budgetLeft];
        }

        last = i;
    }

    displayRows(typeCount, budget);
} 

document.querySelector('#addBudgetForm').addEventListener('submit', function (e) {
    e.preventDefault();

    budget = e.target.elements.budget.value;
    
    runAlgorithm();
});
