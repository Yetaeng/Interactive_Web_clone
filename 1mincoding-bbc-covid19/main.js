// 전역 변수 회피를 하기 위해 즉시실행 익명함수를 만듬
// 즉 변수를 보호하기 위함
(() => {
    const stepElems = document.querySelectorAll('.step');
    const graphicElems = document.querySelectorAll('.graphic-item');
    let currentItem = graphicElems[0]; // 현재 활성화된(visible 클래스가 붙은) .graphic-item을 지정
    let ioIndex;


    // for문을 다 도는 비효율적인 것을 막고자 함
    const io = new IntersectionObserver((entries, observer) => {
        ioIndex = entries[0].target.dataset.index * 1; // index는 문자열 형태보다 숫자 형태가 편해서 *1로 형태를 바꿔줌
        console.log(ioIndex);
    });

    // 이미지와 말풍선 즉, stepElems와 graphicElems에 인덱스를 부여해 같은 인덱스끼리 브라우저 상에서 뜨게 하는 것
    for (let i = 0; i < stepElems.length; i++) {
        io.observe(stepElems[i]);
        //stepElems[i].setAttribute('data-index', i); //data-는 특별한 형태로써 dataset이라고 객체가 이미 있어서 그걸 사용해도 됨(아래 코드)
        stepElems[i].dataset.index = i; // index는 하이픈 다음에 올 이름을 써주는 것
        graphicElems[i].dataset.index = i;
    }

    // visible 클래스 붙여주기
    function activate() {
        currentItem.classList.add('visible');
    }

    // visible 클래스 제거하기
    function inactivate() {
        currentItem.classList.remove('visible');
    }


    window.addEventListener('scroll', () => {
        let step;
        let boundingRect;

        // for (let i = 0; i < stepElems.length; i++) {
        // 아래처럼 바꾸면 루프 횟수를 줄여줌. 현재 보이는 부분만 체크할 수 있도록. 위에 반복문은 10까지 다돌아야함
        for (let i = ioIndex - 1; i < ioIndex + 2; i++) {
            step = stepElems[i];
            if (!step) continue; // ioIndex가 0일때는 i가 -1이 되므로 getBoundingClientRect을 읽어올 수 없다. 그래서 조건문으로 해당 경우만 패스할 수 있도록 해줌
            boundingRect = step.getBoundingClientRect(); // 스크롤 할 때마다 DOMRect라는 객체가 생성됨. 속성에는 위치와 크기가 있음

            // 브라우저 창의 일정 영역에 말풍선이 들어오면, 말풍선의 인덱스번째의 이미지에 visible이라는 클래스를 붙여줌
            if (boundingRect.top > window.innerHeight * 0.1 &&
                boundingRect.top < window.innerHeight * 0.8) {

                inactivate();
                currentItem = graphicElems[step.dataset.index]; // step.dataset.index : 말풍선의 인덱스가 출력됨
                activate();
            }
        }
    });

    activate(); // 함수를 따로 만들어 실행해줌으로써 로드했을 때 graphicElems[0]가 담긴 currentItem에 visible을 지정하는 코드를 쓰지 않아도 됨

})();



/* 
    activate, inactivate 함수를 만들기 전에는 currentItem이라는 변수에 아무것도 없을 때 발생하는 에러를 방지하기 위해
    조건문에서 변수에 어떠한 것이 저장되어 있을 때 visible을 지울 수 있게 했다.
    또한 로드하자마자 변수가 비게 하지 않으려고 변수 선언과 동시에 첫번째 이미지를 할당해서 조건문을 쓰지 않아도 되긴 했다.
    이러한 기능이 있는 동작을 함수로 따로 빼서 중복적으로 visible을 추가 및 삭제하는 코드를 줄일 수 있다.
*/