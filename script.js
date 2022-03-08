// DOM Elements
const questionSubject = document.getElementById("questionSubject")
const questionDescription = document.getElementById("questionDescription")
const questionFormSubmit = document.getElementById("questionFormSubmit");
const responseWin = document.getElementById("responseWin")
const rightWin = document.getElementById("rightWin")
const leftWin = document.getElementById("leftWin");
const questionResponseHead = document.getElementById("questionResponseHead")
const questionResponseList = document.getElementById("questionResponseList")
const questionAddResponse = document.getElementById("questionAddResponse")
const responseName = document.getElementById("responseName")
const responseComment = document.getElementById("responseComment")
const newQuestionForm = document.getElementById("newQuestionForm")
const questionSearch = document.getElementById("questionSearch");
const responseFormSubmit = document.getElementById("responseFormSubmit");
const questionList = document.getElementById("questionList")
const resolveBtn = document.getElementById("resolve-btn")

//LocalStorage setup: -
function setup(){
    var resLocal = getLocalStorage()
    sortObject(resLocal)
    localStorage.setItem("resLocale", JSON.stringify(resLocal))
    renderLeftWin()
}
setup()
// For empty questionList
checkIfEmpty()


//Event Listeners: -
questionList.addEventListener('click', e => questionListTap(e))
questionFormSubmit.addEventListener('click', addQuestion)
responseFormSubmit.addEventListener("click", getKeyForAddResponse)
newQuestionForm.addEventListener('click', showQuestionWin)
questionSearch.addEventListener('keyup',e => search(e))
resolveBtn.addEventListener('click', resolveQuestion)
responseWin.addEventListener('click', e => voting(e))

// Functions: -

// small Functions: -
function sortObject(obj){
    obj.sort((a, b) => (getResVote(a) >= getResVote(b) ? -1 : 1));
}

function renderLeftWin(){
    questionList.innerHTML = ""
    // checkIfEmpty()
    var resLocal = getLocalStorage();
    resLocal.forEach((e) => addQuestionToLeftWin(e));
    checkIfEmpty()
}

function checkIfEmpty(){
    // console.log("len: ", questionList.children.length)
    // console.log(questionList.lastChild.nodeName);
    if (getLocalStorage().length === 0 && (questionList.children.length === 0 || questionList.lastChild.nodeName !== "H2")){
        var temp = document.createElement("h2");
        temp.innerHTML = "No discussions here...";
        questionList.appendChild(temp);
    }
}

function getLocalStorage(){
    var arr = localStorage.getItem("resLocale")
    if(arr) return JSON.parse(arr)
    else    return []
}

function showResponseWin(){
    rightWin.style.display = "none";
    responseWin.style.display = "flex";
}

function showQuestionWin(){
    responseWin.style.display = "none";
    rightWin.style.display = "flex";
}

function getResVote(obj){
    // console.log("resVot: ", Number(obj.upVote) + Number(obj.downVote));
    return Number(obj.upVote) + Number(obj.downVote);
}

function upVote(obj){
    // console.log("upvote: ", obj.upVote)
    obj.upVote = Number(obj.upVote) + 1;
}

function downVote(obj){
    // console.log("downvote: ", obj.downVote)
    obj.downVote = Number(obj.downVote) - 1;
}

// Major Functions: -
function voting(e){
    var element = e.target;
    if(element.classList.contains("vote-btn")){
        var divElementContainer = element.parentElement.parentElement.parentElement;
        var key = Number(divElementContainer.getAttribute("key"))
        if ( element.getAttribute("id") === "upVoteResponse" || element.getAttribute("id") === "downVoteResponse" )
            updateResponseVotes(element, key)
        else
            updateQuestionVotes(element, key)
    }
}

function updateResponseVotes(element, key){
    resLocal = getLocalStorage()
    var divElementContainer = element.parentElement.parentElement.parentElement;

    var questionRedefined = document.getElementById("questionItem-redefined");  
    var idx = resLocal.findIndex( data => data.id === Number( questionRedefined.getAttribute("key") ) );


    var obj_idx = resLocal[idx].responses.findIndex( data => data.commentId === key )
    var obj = resLocal[idx].responses[obj_idx]
    if(element.getAttribute("id") === "upVoteResponse"){
        upVote(obj)
        console.log("response OBJ: ", obj)
    }
    else{
        downVote(obj)
    }
    divElementContainer.firstChild.firstChild.innerHTML = String( getResVote(obj) )
    localStorage.setItem("resLocale", JSON.stringify(resLocal))
}

function updateQuestionVotes(element, key){
    resLocal = getLocalStorage();
    var divElementContainer = element.parentElement.parentElement.parentElement;

    var questionRedefined = document.getElementById("questionItem-redefined");
    var idx = resLocal.findIndex(
        (data) => data.id === Number(questionRedefined.getAttribute("key"))
    );

    var obj = resLocal[idx];
    if (element.getAttribute("id") === "upVoteQuestion") {
        upVote(obj);
    } else {
        downVote(obj);
    }
    divElementContainer.firstChild.firstChild.innerHTML = String( getResVote(obj) );
    localStorage.setItem("resLocale", JSON.stringify(resLocal))

    renderLeftWin()
    showResponseWin()
}

function addQuestion(){
    if(questionSubject.value.trim() === "" || questionDescription.value.trim() === ""){
        alert("Cannot accept Empty Question fields :)")
        return;
    }
    question = {
        id: Date.now(),
        subject: questionSubject.value,
        desc: questionDescription.value,
        upVote: 0,
        downVote: 0,
        responses: [],
    };
    questionSubject.value = ""
    questionDescription.value = ""
    addToLocalStorage(question)
    addQuestionToLeftWin(question)
}

function addToLocalStorage(question){
    resLocal = getLocalStorage()
    resLocal.push(question);
    localStorage.setItem("resLocale", JSON.stringify(resLocal))
}

function deleteFromLocalStorage(key){
    resLocal = getLocalStorage()
    var idx = resLocal.findIndex(e => e.id === key)
    // console.log("idx: ", idx)
    resLocal.splice(idx, 1)
    localStorage.setItem("resLocale", JSON.stringify(resLocal))
    // console.log("lendsa: ", questionList.children.length);
    checkIfEmpty()
}

function addQuestionToLeftWin(question){
    //remove the h5 tag of "No discussions here..."
    // console.log(questionList.lastChild.nodeName)
    if (questionList.children.length !== 0 && questionList.lastChild.nodeName === "H2")   questionList.lastChild.remove();

    var container = document.createElement("div");
    container.setAttribute("class", "flex listBorder");
    container.setAttribute("key", question.commentId);

    var questionItemVoteCount = document.createElement("div");
    questionItemVoteCount.setAttribute("class", "voteCountDiv");

    var resVote = document.createElement("h3");
    resVote.innerHTML = getResVote(question);

    questionItemVoteCount.appendChild(resVote);

    var first = document.createElement("div");
    first.setAttribute("class", "responseFirstUp flex unclickable");

    var upVoteBtn = document.createElement("button");
    upVoteBtn.setAttribute("id", "upVoteQuestion");
    upVoteBtn.setAttribute("class", "vote-btn cursor hide unclickable");

    var upImg = document.createElement("img");
    upImg.setAttribute("src", "images/votes/upArrow.png");
    upImg.setAttribute("class", "unclickable vote-img");

    var second = document.createElement("div");
    second.setAttribute("class", "responseSecondUp flex");

    var downVoteBtn = document.createElement("button");
    downVoteBtn.setAttribute("id", "downVoteQuestion");
    downVoteBtn.setAttribute("class", "vote-btn cursor hide unclickable");

    var downImg = document.createElement("img");
    downImg.setAttribute("src", "images/votes/downArrow.png");
    downImg.setAttribute("class", "unclickable vote-img");

    var CreatedOn = document.createElement("p")
    CreatedOn.innerHTML = new Date(question.id).toLocaleString()


    var questionItem = document.createElement("div");
    questionItem.setAttribute("key", question.id);
    questionItem.classList.add("questionItem");
    questionItem.classList.add("cursor");

    var questionTitle = document.createElement("h3");
    questionTitle.style.marginRight = "auto";
    questionTitle.classList.add("unclickable");

    var questionSubTitle = document.createElement("p");
    questionSubTitle.classList.add("unclickable");

    questionTitle.innerHTML = question.subject;
    if (question.desc.length > 30) {
        var x = question.desc;
        x = x.slice(0, 30) + "....";
        questionSubTitle.innerHTML = x;
    }
    else questionSubTitle.innerHTML = question.desc;

    upVoteBtn.appendChild(upImg);
    downVoteBtn.appendChild(downImg);


    first.appendChild(questionTitle);
    // first.appendChild(CreatedOn);
    first.appendChild(upVoteBtn);
    first.appendChild(downVoteBtn);

    second.appendChild(questionSubTitle);

    questionItem.appendChild(first);
    questionItem.appendChild(second);

    container.appendChild(questionItemVoteCount);
    container.appendChild(questionItem);

    questionList.appendChild(container);

}

function addResponse(key){
    if (responseName.value.trim() === "" || responseComment.value.trim() === "") {
        alert("Cannot accept Empty comment fields :)");
        return;
    }
    console.log("ADDing response :)", key)
    response = {
        commentId: Date.now(),
        commentHead: responseName.value,
        commentAns: responseComment.value,
        upVote: 0,
        downVote: 0,
    };
    responseName.value = ""
    responseComment.value = ""
    addResponseToLocalStorage(key, response)
    addToResponseList(response)
}

function addResponseToLocalStorage(key, response){
    resLocal = getLocalStorage()
    var idx = resLocal.findIndex(e => key === e.id);
    console.log(idx, " response Question: ", resLocal[idx], key)
    if(resLocal[idx].responses.length === 0)    questionResponseList.lastChild.remove()
    resLocal[idx].responses.push(response);
    localStorage.setItem("resLocale", JSON.stringify(resLocal))
}

function addToResponseList(response){
    var container = document.createElement("div")
    container.setAttribute("class", "flex")
    container.setAttribute("key", response.commentId);


    var listElementVoteCount = document.createElement("div")
    listElementVoteCount.setAttribute("class", "voteCountDiv")

    var resVote = document.createElement("h3")
    resVote.innerHTML = getResVote(response)

    listElementVoteCount.appendChild(resVote)

    var ListElement = document.createElement("div")
    ListElement.setAttribute("class", "responseListElement");

    var first = document.createElement("div")
    first.setAttribute("class", "responseFirstUp flex")

    var upVoteBtn = document.createElement("button");
    upVoteBtn.setAttribute("id", "upVoteResponse");
    upVoteBtn.setAttribute("class", "vote-btn cursor")
    
    var upImg = document.createElement("img");
    upImg.setAttribute("src", "images/votes/upArrow.png");
    upImg.setAttribute("class", "unclickable vote-img");

    var second = document.createElement("div")
    second.setAttribute("class", "responseSecondUp flex")
    
    var downVoteBtn = document.createElement("button");
    downVoteBtn.setAttribute("id", "downVoteResponse");
    downVoteBtn.setAttribute("class", "vote-btn cursor");

    var downImg = document.createElement("img")
    downImg.setAttribute("src", "images/votes/downArrow.png")
    downImg.setAttribute("class", "unclickable vote-img");

    var elementName = document.createElement("h4")
    elementName.classList.add("unclickable")
    elementName.style.marginRight = "auto";
    elementName.innerHTML = response.commentHead

    var elementComment = document.createElement("p");
    elementComment.classList.add("unclickable");
    elementComment.innerHTML = response.commentAns


    upVoteBtn.appendChild(upImg)
    downVoteBtn.appendChild(downImg)

    first.appendChild(elementName)
    first.appendChild(upVoteBtn)
    first.appendChild(downVoteBtn);

    second.appendChild(elementComment)

    ListElement.appendChild(first)
    ListElement.appendChild(second)

    container.appendChild(listElementVoteCount)
    container.appendChild(ListElement);

    questionResponseList.appendChild(container)
}

function questionListTap(e){
    // console.log(e.target)
    if(e.target.classList.contains("questionItem")){

        questionResponseList.innerHTML = ""
        var key = e.target.getAttribute("key")
        key = Number(key)

        // Create a copy of the Question to append it on the Right
        var element = e.target.parentElement.cloneNode(true)
        element.setAttribute("class", "flex listBorder-redefined");

        var temp = element.children[1]
        temp.setAttribute("id", "questionItem-redefined")
        temp.classList.remove("questionItem")
        temp.classList.add("questionItem-redefined");

        // Remove buttons class `hide` & `unclickable` to display in questionRedefined
        temp.firstChild.children[1].classList.remove("hide")
        temp.firstChild.children[1].classList.remove("unclickable")
        temp.firstChild.children[2].classList.remove("hide")
        temp.firstChild.children[2].classList.remove("unclickable")

        //  Adds Non Spliced Description of the question to `questionRedefined`
        resLocal = getLocalStorage()
        var idx = resLocal.findIndex(data => data.id === key )
        temp.children[1].firstChild.innerHTML = resLocal[idx].desc;

        // Set Local Responses and show Response in rightWin
        showResponseWin();
        getLocalResponses(key);
        if(questionResponseHead.children.length > 0)    questionResponseHead.lastChild.remove()
        questionResponseHead.appendChild(element)
    }
}

function getKeyForAddResponse(){
    var questionRedefined = document.getElementById("questionResponseHead").children[0].children[1]
    console.log("questionRedefined: ", questionRedefined)    
    var key = Number(questionRedefined.getAttribute("key"))
    addResponse(key)
}

function getLocalResponses(key){
    resLocal = getLocalStorage()
    var idx = resLocal.findIndex(e => key === e.id)
    if(idx >= 0 && resLocal[idx].responses.length > 0){
        sortObject(resLocal[idx].responses)
        resLocal[idx].responses.forEach( e => addToResponseList(e) );
    }
    else{
        var noResponseElement = document.createElement("p")
        noResponseElement.innerHTML = "No Comments yet..."
        questionResponseList.appendChild(noResponseElement)
    }
}

function resolveQuestion(){
    var questionRedefined = document.getElementById("questionResponseHead").children[0];
    var key = Number(questionRedefined.children[1].getAttribute("key"));
    console.log({key}, questionRedefined)
    deleteFromLocalStorage(key);
    showQuestionWin();
    questionRedefined.remove()
    // document.querySelector(`[key='${key}']`).remove() //(`[key = '${obj.id}']`)
    renderLeftWin()
}

function search(e){
    var searchBoxVal = e.target.value
    // console.log(questionList.children)
    searchBoxVal = searchBoxVal.trim().toLowerCase()
    var count = 0;
    for(var i = 0; i < questionList.children.length; ++i){
        var temp = questionList.children[i];
        var temp_1 = temp.children[1].children[0].children[0].innerHTML.toLowerCase()

        // Extracting the unsliced Version of description From Local Storage :)
        var key = Number( temp.children[1].getAttribute("key") )
        var resLocal = getLocalStorage()
        var idx = resLocal.findIndex(data => data.id === key)
        var temp_2 = resLocal[idx].desc.toLowerCase();

        if(searchBoxVal !== "" && !temp_1.includes(searchBoxVal) && !temp_2.includes(searchBoxVal)){
            temp.style.display = "none"
            ++count;
        }
        else{
            temp.style.display = "flex";
            --count;
        }
    }
    if(count === questionList.children.length){
        if(leftWin.lastChild.nodeName !== "H2"){
            var noQuestionsFound = document.createElement("h2");
            noQuestionsFound.innerHTML = "No Match Found";
            leftWin.appendChild(noQuestionsFound);
        }
    }
    else{
        if(leftWin.lastChild.nodeName === "H2")    leftWin.lastChild.remove()
    }
}


// Update the Response Vote counter in Realtime and Local
// Add Questions Vote Counter
// Sort the resLocal and re render after each Vote :)