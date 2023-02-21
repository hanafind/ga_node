// document.addEventListener("hide.bs.modal", function() {
//   location.href = document.referrer; 
// });

function fn_reqConsult(event) {
  event.preventDefault();

  if (!checkBrdt()) {
    toast("생년월일을 정확히 입력해주세요");
    return;
  } 
  if (!checkPhoneNumber()) {
    toast("연락처를 정확히 입력해주세요");
    return;
  }

  if (!document.getElementById('dropdownCheck').checked) {
    return;
  }

  if (!document.getElementById('sex_m').checked && !document.getElementById('sex_w').checked) {
    return;
  }
  
  const formData = new FormData(event.target);

  fetch("/cs/postConsultant", {
    method: "POST",
    body: new URLSearchParams({
      custNm: formData.get("custNm"),
      sex: formData.get("sex"),
      brdt: formData.get("brdt"),
      ptblTlno: formData.get("ptblTlno"),
      cnslDtm: formData.get("cnslDtm"),
      arNm: formData.get("arNm"),
      memo: formData.get("memo"),
    }),
  })
    .then(res => {
      return res.json();
    })
    .then(json => {
        if (json.code == '0') {
          location.pathname = '/cs/consultantComplete';
        } else {
          toast(json.msg);
        }
    })
    .catch(err => {
      toast(err);
    });
}

function checkBrdt(){
  const brdt = document.getElementById("brdt").value;
  if (brdt !== "" && brdt.length < 8){
		return false;
	} else {
    var regeExp = /^(19[0-9][0-9]|20\d{2})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
    return regeExp.test(brdt);
  }
}

function checkPhoneNumber(){
  const ptblTlno = document.getElementById("ptblTlno").value;
  if (ptblTlno != "" && ptblTlno.length < 12){
		return false;
	} else {
    var regeExp = /^(01[016789]{1})-[0-9]{3,4}-[0-9]{4}$/;
	  return regeExp.test(ptblTlno);
  }
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

 