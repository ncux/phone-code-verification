
const submitUrl = 'http://dl.sep18.xyz:8001/sendcode?phonenumber=';
const phoneNumber = document.querySelector('#phoneNumber');
const smsCode = document.querySelector('#smsCode');
const sendSMScode = document.querySelector('#sendSMScode');
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
    let options = {
        method: "POST",
        headers: {
            "mode": "no-cors",
            "Content-Type": "text/plain"
        },
        body: JSON.stringify(phoneNumber.value)
    };
    let response = await fetch(`${submitUrl} + ${phoneNumber.value}`, options);
    let data = await response.text();
    console.log(data);
}


confirmCode.addEventListener('click', enableDownloadLink);

function enableDownloadLink() {
    let downloadLink = `http://dl.sep18.xyz:8001/download?phonenumber=${phoneNumber.value}&code=${smsCode.value}&file=centos.iso`;
    downloadAnchor.setAttribute('href', downloadLink);
}


