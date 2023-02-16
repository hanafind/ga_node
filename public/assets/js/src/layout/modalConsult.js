document.addEventListener("hide.bs.modal", function() {
  document.getElementById("form").reset();
  location.href = document.referrer; 
});

function fn_reqConsult(event) {
  event.preventDefault();

  if (!checkBrdt()) {
    alert("생년월일 이상해");
    return;
  } 
  if (!checkPhoneNumber()) {
    alert("폰번호 이상해");
    return;
  }

  const formData = formDataToObject(new FormData(event.target));
  
  fetch("/faq/consult", {
    method: "POST",
    body: new URLSearchParams({
      custNm: formData.get("custNm"),
      sex: formData.get("sex"),
      brdt: formData.get("brdt"),
      ptblTlno: formData.get("ptblTlno"),
      cnslDtm: formData.get("cnslDtm"),
      arNm: formData.get("arNm"),
    }),
  })
    .then(res => {
      return res.json();
    })
    .then(json => {
      if (json.result === '200') {
        alert(json.msg);
        location.href = document.referrer;
      }
    })
    .catch(err => {
      alert(err);
    });
}

function checkBrdt(){
  const brdt = document.getElementById("brdt").value;
  if(brdt.length < 8){
		return false;
	}
  var regeExp = /^(19[0-9][0-9]|20\d{2})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
  return regeExp.test(brdt);
}

function checkPhoneNumber(){
  const ptblTlno = document.getElementById("ptblTlno").value;
  if(ptblTlno == ""){
		return false;
	}
	var regeExp = /^(01[016789]{1})-[0-9]{3,4}-[0-9]{4}$/;
	return regeExp.test(ptblTlno);
}

function addHyphen(target) {
  switch(target.id) {
  case 'brdt':
    target.value = target.value.replace(/[^0-9]/g, '').replace(/^(\d{0,4})(\d{0,2})(\d{0,2})$/g, "$1-$2-$3").replace(/(\-{1,2})$/g, "");
    break;
  case 'ptblTlno':
    target.value = target.value.replace(/[^0-9]/g, '').replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/(\-{1,2})$/g, "");
    break;
  }
 }
