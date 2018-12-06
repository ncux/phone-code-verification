
const submitUrl = 'http://dl.sep18.xyz:8001/sendcode?phonenumber=';
const phoneNumber = document.querySelector('#phoneNumber');
const smsCode = document.querySelector('#smsCode');
const sendSMScode = document.querySelector('#sendSMScode');
const confirmCode = document.querySelector('#confirmCode');
const downloadAnchor = document.querySelector('#downloadLink');
const successMessage = document.querySelector('#successMessage');
const errorMessage = document.querySelector('#errorMessage');

sendSMScode.addEventListener('click', sendSMSverificationCode);

// those list items must show something when clicked
// let items = document.querySelectorAll('.items');
// items.forEach(item => {
//     item.addEventListener('click', alertItemContent);
// });
//
// function alertItemContent() {
//     alert(`${this.innerHTML}`);
// }

function sendSMSverificationCode() {
    console.log(phoneNumber.value);
    getSMScode();
}

async function getSMScode() {
    await fetch(`${submitUrl} + ${phoneNumber.value}`);
    showSuccessMessage();
    // setTimeout(showSuccessMessage, 3000);
}

function showSuccessMessage() {
    successMessage.style.display = 'block';
}

confirmCode.addEventListener('click', enableDownloadLink);

async function enableDownloadLink() {
    removeSuccessMessage();
    let downloadLink = `http://dl.sep18.xyz:8001/download?phonenumber=${phoneNumber.value}&code=${smsCode.value}&file=centos.iso`;
    let response = await fetch(downloadLink);
    if (response.status === 200) {
        downloadAnchor.setAttribute('href', downloadLink);
    } else {
        showErrorMessage();
    }
}

function removeSuccessMessage() {
    successMessage.style.display = 'none';
}

function showErrorMessage() {
    errorMessage.style.display = 'block';
}




