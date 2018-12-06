
const submitUrl = 'http://dl.sep18.xyz:8001/sendcode?phonenumber=';
const phoneNumber = document.querySelector('#phoneNumber');
const smsCode = document.querySelector('#smsCode');
const sendSMScode = document.querySelector('#sendSMScode');
const message = document.querySelector('#message');
const confirmCode = document.querySelector('#confirmCode');
const downloadAnchor = document.querySelector('#downloadLink');

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

async function sendSMSverificationCode() {
    console.log(phoneNumber.value);
    await getSMScode();
}

async function getSMScode() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `${submitUrl} + ${phoneNumber.value}`, true);

    xhr.onload = function() {
        if(xhr.status === 200) {
            console.log(xhr.responseText);
            message.style.display = 'block';
            message.innerHTML = xhr.responseText;
        }
    };

    xhr.send();
}


confirmCode.addEventListener('click', enableDownloadLink);

function enableDownloadLink() {
    let downloadLink = `http://dl.sep18.xyz:8001/download?phonenumber=${phoneNumber.value}&code=${smsCode.value}&file=centos.iso`;
    downloadAnchor.setAttribute('href', downloadLink);
}


