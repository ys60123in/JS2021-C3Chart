// Data
let data = [];

// Ajax Init
initData();

// Element
const selectRegionSearch = document.querySelector(".regionSearch");
const textTicketName = document.querySelector("#ticketName");
const textTicketImgUrl = document.querySelector("#ticketImgUrl");
const selectTicketRegion = document.querySelector("#ticketRegion");
const numberTicketPrice = document.querySelector("#ticketPrice");
const numberTicketNum = document.querySelector("#ticketNum");
const numberTicketRate = document.querySelector("#ticketRate");
const textTicketDescription = document.querySelector("#ticketDescription");
const btnAddTicket = document.querySelector("#btnAddTicket");

// Event
selectRegionSearch.addEventListener("change", regionSearchChanged, false);
textTicketName.addEventListener("blur", checkInputIsLegal, false);
textTicketImgUrl.addEventListener("blur", checkInputIsLegal, false);
selectTicketRegion.addEventListener("blur", checkInputIsLegal, false);
numberTicketPrice.addEventListener("blur", checkInputIsLegal, false);
numberTicketNum.addEventListener("blur", checkInputIsLegal, false);
numberTicketRate.addEventListener("blur", checkInputIsLegal, false);
textTicketDescription.addEventListener("blur", checkInputIsLegal, false);
btnAddTicket.addEventListener("click", addTicketData, false);

// Function
// Axios Ajax取得資料
function initData() {
    axios
        .get(
            "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json"
        )
        .then((response) => {
            // console.log(response.data.data);
            data = response.data.data;
            displayTicketCardArea(data);
        });
}

// 根據傳入的data顯示TicketCard
function displayTicketCardArea(data) {
    // Element
    const ticketCardArea = document.querySelector(".ticketCard-area");
    const searchResultText = document.querySelector("#searchResult-text");
    const cantFindArea = document.querySelector(".cantFind-area");

    // 寫入搜尋到幾筆資料
    searchResultText.textContent = `本次搜尋共 ${data.length} 筆資料`;

    // 顯示票卡資訊
    let dataString = "";
    data.forEach((item) => {
        dataString += `<li class="ticketCard">
            <div class="ticketCard-img">
                <a href="#">
                    <img src="${item.imgUrl}" alt="">
                </a>
                <div class="ticketCard-region">${item.area}</div>
                <div class="ticketCard-rank">${item.rate}</div>
            </div>
            <div class="ticketCard-content">
                <div>
                    <h3>
                        <a href="#" class="ticketCard-name">${item.name}</a>
                    </h3>
                    <p class="ticketCard-description">
                        ${item.description}
                    </p>
                </div>
                <div class="ticketCard-info">
                    <p class="ticketCard-num">
                        <span><i class="fas fa-exclamation-circle"></i></span>
                        剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
                    </p>
                    <p class="ticketCard-price">
                        TWD <span id="ticketCard-price">$${item.price}</span>
                    </p>
                </div>
            </div>
        </li>`;
    });
    ticketCardArea.innerHTML = dataString;

    // 顯示有無查詢到資料
    if (data.length <= 0) {
        elementDisplay(cantFindArea);
    } else {
        elementHide(cantFindArea);
        displayRegionProportion(data);
    }
}

// 下拉選單篩選顯示區域
function regionSearchChanged() {
    // console.log(
    //     selectRegionSearch.options[selectRegionSearch.selectedIndex].value
    // );
    const selectedValue =
        selectRegionSearch.options[selectRegionSearch.selectedIndex].value;
    if (selectedValue === "") {
        displayTicketCardArea(data);
    } else {
        displayTicketCardArea(
            data.filter((item) => item.area === selectedValue)
        );
    }
}

// 新增Ticket資料
function addTicketData() {
    // 前置判斷
    if (
        !isInputValueLegal(textTicketName) ||
        !isInputValueLegal(textTicketImgUrl) ||
        !isInputValueLegal(selectTicketRegion) ||
        !isInputValueLegal(numberTicketPrice) ||
        !isInputValueLegal(numberTicketNum) ||
        !isInputValueLegal(numberTicketRate) ||
        !isInputValueLegal(textTicketDescription)
    ) {
        alert("請確認資料輸入是否完整或有提示異常!!");
        return;
    }

    // Parameters
    const name = textTicketName.value;
    const imgUrl = textTicketImgUrl.value;
    const area =
        selectTicketRegion.options[selectTicketRegion.selectedIndex].value;
    const price = Number(numberTicketPrice.value);
    const group = Number(numberTicketNum.value);
    const rate = Number(numberTicketRate.value);
    const description = textTicketDescription.value;

    // 產生物件並加入data物件陣列
    let objTicket = {};
    objTicket.id =
        data.length <= 0 ? 1 : Math.max(...data.map((item) => item.id)) + 1;
    objTicket.name = name;
    objTicket.imgUrl = imgUrl;
    objTicket.area = area;
    objTicket.description = description;
    objTicket.group = group;
    objTicket.price = price;
    objTicket.rate = rate;
    data.push(objTicket);

    alert("資料新增成功!!");

    // 清除資料
    clearData();

    // 將地區搜尋篩選變成全部地區
    selectRegionSearch.selectedIndex = 1;
    regionSearchChanged();
}

// 清除資料
function clearData() {
    textTicketName.value = "";
    textTicketImgUrl.value = "";
    selectTicketRegion.selectedIndex = 0;
    numberTicketPrice.value = "";
    numberTicketNum.value = "";
    numberTicketRate.value = "";
    textTicketDescription.value = "";
}

// Input元件離開時觸發
function checkInputIsLegal(e) {
    const prompt = document.querySelector(`#${e.target.id}-message`);

    // 檢查是否有輸入值
    const isElementInput = checkElementInput(e);

    // 檢查數值元件值是否輸入正確
    const isElementNumberCorrect = checkElementNumber(e);

    // 如果有異常就顯示錯誤訊息
    if (!isElementInput || !isElementNumberCorrect) {
        elementDisplay(prompt);
    } else {
        elementHide(prompt);
    }
}

// 檢查是否有輸入值
function checkElementInput(e) {
    if (!isValueInput(e.target.value)) {
        modifyErrorMessage(e, "必填!");
        return false;
    }

    return true;
}

// 檢查數值元件值是否輸入錯誤
function checkElementNumber(e) {
    if (e.target.type === "number") {
        if (isNumberError(e.target.value)) {
            modifyErrorMessage(e, "輸入數值異常!");
            return false;
        } else if (isNumberLessThanZero(e.target.value)) {
            modifyErrorMessage(e, "輸入數值不能小於零!");
            return false;
        } else if (
            e.target.id === "ticketRate" &&
            (e.target.value < 1 || e.target.value > 10)
        ) {
            modifyErrorMessage(e, "套票星級必須介於 1 和 10 之間!");
            return false;
        } else if (e.target.id === "ticketNum" && e.target.value < 1) {
            modifyErrorMessage(e, "套票組數必須大於或等於 1 組!");
            return false;
        }
    }

    return true;
}

// 顯示元件
function elementDisplay(e) {
    e.setAttribute("style", "display:block");
}

// 隱藏元件
function elementHide(e) {
    e.setAttribute("style", "display:none");
}

// 修改異常訊息內容
function modifyErrorMessage(e, msg) {
    const errorMessage = document.querySelector(
        `#${e.target.id}-message > span`
    );
    errorMessage.textContent = msg;
}

// 判斷是否有輸入
function isValueInput(value) {
    return value !== "";
}

// 判斷數值是否異常
function isNumberError(value) {
    return isNaN(value) || !isFinite(value);
}

// 判斷數值是否小於零
function isNumberLessThanZero(value) {
    return value < 0;
}

// 判斷輸入的數值是否合法
function isInputValueLegal(e) {
    // 判斷是否輸入
    if (!isValueInput(e.value)) {
        return false;
    }

    // 判斷數值是否正確
    if (
        e.type === "number" &&
        (isNumberError(e.value) || isNumberLessThanZero(e.value))
    ) {
        return false;
    }

    // 客製化判斷
    // 套票星級必須介於1~10之間
    if (e.id === "ticketRate" && (e.value < 1 || e.value > 10)) {
        return false;
    }
    // 套票組數必須大於或等於 1 組
    else if (e.id === "ticketNum" && e.value < 1) {
        return false;
    }

    return true;
}

// 顯示套票地區比重
function displayRegionProportion(data) {
    let objRegions = {};
    data.forEach((item) => {
        if (objRegions[item.area] === undefined) {
            objRegions[item.area] = 1;
        } else {
            objRegions[item.area] += 1;
        }
    });

    let chartData = [];
    let aryRegions = Object.keys(objRegions);
    aryRegions.forEach((item) => {
        let aryRegionData = [];
        aryRegionData.push(item);
        aryRegionData.push(objRegions[item]);
        chartData.push(aryRegionData);
    });

    renderDonutChart(chartData);
}

// 渲染Donut Chart
function renderDonutChart(chartData) {
    const chart = c3.generate({
        bindto: "#areaChart",
        data: {
            columns: chartData,
            type: "donut",
            colors: {
                高雄: "#E68618",
                台中: "#5151D3",
                台北: "#26C0C7",
            },
        },
        donut: {
            title: "套票地區比重",
            width: 10,
            label: {
                show: false,
            },
        },
        size: {
            height: 160,
            width: 160,
        },
    });
}
