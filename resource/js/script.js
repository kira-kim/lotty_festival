

function popupchange(){
  var popup_01 = document.querySelector(".campaign_2109 .popup_01");
  var popup_02 = document.querySelector(".campaign_2109 .popup_02");


  popup_01.style.display = "none";
  popup_02.style.display = "block";

}


// input background
function testScoreClick(){
  var test_score = document.querySelector(".test_score");

  test_score.style.backgroundImage="url('')"
}
function testAnswerClick(){
  var test_answer = document.querySelector(".test_answer");

  test_answer.style.backgroundImage="url('')"
}


// 입력란 공백
function addList(){

	if (!$(".test_score").validate("테스트점수", true, {numeric: true, minValue: 0, maxValue: 100})) { return false; }
	// if (!$(".test_score").validate("테스트점수", true, {})) { return false; }
	if (!$(".test_answer").validate("퀴즈 정답", true)) { return false; }
	var answer = '1366';
	var cus_answer = $(".test_answer").val().replace(/\s/gi,"");
	if( cus_answer.toUpperCase() != answer ){
		alert('정답을 확인해주세요');
		$('.test_answer').focus();
		doubleSubmitFlag = false;
		return false;
	}
	return true;
}

//개인정보제공동의 입력란 공백
function addIntro(){

	if (!$(".name").validate("이름", true)) { return false; }
	if (!$(".number").validate("연락처", true, {mobile: true})) { return false; }
	if (!$(".mail").validate("이메일", true, {emailChk: true})) { return false; }
    return true;
}


// 참여하기 버튼 클릭
function attendClick(){
    var body = document.querySelector('body');
    var privacy = document.querySelector('.privacy_agree_bg');
    var ret = addList();

    if(!ret){
        return false;
    }
    body.classList.add('layer-open');
    privacy.style.display = "block";
    
}


// 개인정보제공 동의버튼 클릭
function agreeClick(){
    var at_popup = document.querySelector('.attend_popup_bg');
    var privacy2 = document.querySelector('.privacy_agree_bg');

    var agree = addIntro();
    if (!agree) {
        return false;
    }

    at_popup.style.display="block";
    privacy2.style.display="none";


	// if(doubleSubmitCheck()) return;
	// var formData = { 
	// 	score : $('.test_score').val()
	// 	, answer : $('.test_answer').val()
	// 	, name : $('.name').val() 
	// 	, phone : $('.number').val() 
	// 	, email : $('.mail').val() 
	// }
	// console.log( formData );
	// $.ajax({
	// 	url: '/festival/festival202107_proc.php',
	// 	type: 'POST',
	// 	data: formData,
	// 	dataType: 'json',
	// 	error : function(data){
	// 		console.log(data);
	// 		alert('데이터 저장에 실패했습니다.\n잠시후 다시 시도해 주세요.');
	// 	},
	// 	success : function(data){
	// 		console.log(data);
	// 		if(data.result == '1'){
	// 			//alert('응모가 완료되었습니다.');
	// 			//location.href='http://2021dhevent.co.kr/festival/index.html';
	// 			at_popup.style.display = "block";
	// 			privacy2.style.display = "none";
	// 			$('#sendForm')[0].reset();
	// 		}else{
	// 			//alert('데이터 저장에 실패했습니다.\n다시 시도해 주세요.');
	// 			alert(data.msg); 
	// 			//location.reload();
	// 		}
	// 	},
	// 	complete : function () {
	// 		doubleSubmitFlag = false;
	// 	}
	// });
}


// 개인정보제공 거절버튼 클릭
function rejectClick(){
    var body2 = document.querySelector('body');
    var privacy3 = document.querySelector('.privacy_agree_bg');
	
    body2.classList.remove('layer-open');
    privacy3.style.display = "none";
}

// 참여완료버튼 클릭
function closeClick(){
    var body3 = document.querySelector('body');
    var at_popup2 = document.querySelector('.attend_popup_bg');

    body3.classList.remove('layer-open');
    at_popup2.style.display = "none";
}

//중복지원 방지
// var doubleSubmitFlag = false;
// function doubleSubmitCheck(){
//     if(doubleSubmitFlag){
//         return doubleSubmitFlag;
//     }else{
//         doubleSubmitFlag = true;
//         return false;
//     }
// }
// function getTimeStamp() {
//   var d = new Date();
//   var s =
//     leadingZeros(d.getFullYear(), 4) + '-' +
//     leadingZeros(d.getMonth() + 1, 2) + '-' +
//     leadingZeros(d.getDate(), 2) + ' ' +

//     leadingZeros(d.getHours(), 2) + ':' +
//     leadingZeros(d.getMinutes(), 2) + ':' +
//     leadingZeros(d.getSeconds(), 2);

//   return s;
// }

// function leadingZeros(n, digits) {
//   var zero = '';
//   n = n.toString();

//   if (n.length < digits) {
//     for (i = 0; i < digits - n.length; i++)
//       zero += '0';
//   }
//   return zero + n;
// }
