function fn_reqConsult(event) {
  event.preventDefault();

  if (!checkCustNm()) {
    moveScroll(document.getElementById("custNm"));
    toast("이름을 정확히 입력해주세요");
    return;
  } 
  if (!document.getElementById('sex_m').checked && !document.getElementById('sex_w').checked) {
    moveScroll(document.getElementById("sex_m"));
    toast("성별을 선택해주세요");
    return;
  }
  if (!checkBrdt()) {
    moveScroll(document.getElementById("brdt"));
    return;
  } 
  if (!checkPhoneNumber()) {
    moveScroll(document.getElementById("ptblTlno"));
    toast("연락처를 정확히 입력해주세요");
    return;
  }

  if (!document.getElementById('dropdownCheck').checked) {
    toast("필수 약관에 동의해주세요");
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
          location.replace('/cs/consultantComplete');
        } else {
          toast(json.msg);
        }
    })
    .catch(err => {
      toast(err);
    });
}

function checkCustNm(){
  const custNm = document.getElementById("custNm").value;
  if (custNm == "" || custNm.length < 2){
		return false;
	} else {
    return true;
  }
}

function checkBrdt(){
  const brdt = document.getElementById("brdt").value;
  if (brdt != "" && brdt.length < 8){
    toast("생년월일을 정확히 입력해주세요");
    return false;
	} else if (calcAge(brdt) < 15) {    
    toast("만 14세미만은 상담신청이 불가합니다");
    return false;
  } else {
    var regeExp = /^(19[0-9][0-9]|20\d{2})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
    if (!regeExp.test(brdt)) {
      toast("생년월일을 정확히 입력해주세요");
    } else {
      return true;
    }
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

 function moveScroll(target) {
  target.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
 }

 function calcAge(target) {
  const today = new Date();
  let date = target.replace(/-/g, '');
  const year = date.substr(0,4);
  const month = date.substr(4,2);
  const day = date.substr(6,2);
  console.log('date : ' + date);
  
  const birthDate = new Date(year, month, day);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  // if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
  //     age--;
  // }
  console.log('age : ' + age);
  return age;
 }

