var sentences = [];
var correctSentence = "man se ketãb dãram";
var extraWords = "mã ketãbhã"
var words = [];
chosenWords = [];
sentenceNr = 0;
numberOfSentences = 0;
var data;
var activeLesson;
var activeLessonID = "0";
var errorsInLesson = 0;

window.addEventListener("load", () => {
    console.log("Page loaded...");
    init();
});

function init() {
    loadJSON();
}

function loadJSON() {
    var url = "https://is87.github.io/persian/lessons.json";
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            data = myJson;
            loadLessonMenu();
        });
}

function setCookie(cname, cvalue, exdays = 365) {
    /*var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + encodeURIComponent(cvalue) + "; " + expires;*/
    localStorage.setItem(cname, cvalue);
}

function getCookie(cname) {
    /*var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return decodeURIComponent(c.substring(name.length, c.length));
        }
    }
    return "";
    */
    return localStorage.getItem(cname);
}

function eraseCookies() {
    /*for(i=0;i< data.lessons.length;i++){
        setCookie("lesson-"+data.lessons[i].id, "", -10);
    }*/
    localStorage.clear();
    loadLessonMenu();
}
function loadLessonMenu() {
    document.getElementById("lessonsMenuBackground").style.display = "block";
    document.getElementById("lessonsMenu").innerHTML = "LEKTIONER";
    for (i = 0; i < data.lessons.length; i++) {
        document.getElementById("lessonsMenu").innerHTML += "<div id='lessonButton" + i + "' data-status='go' data-index='" + i + "'' onclick='clickLesson(this);' class='lessonButton'><i class='fa fa-star'></i><span>" + data.lessons[i].name + "</span><i class='fa fa-star'></i></div>";
        if (getCookie("lesson-" + data.lessons[i].id) == "DONE") {
            document.getElementById("lessonButton" + i).lastElementChild.style.visibility = "visible";
            document.getElementById("lessonButton" + i).lastElementChild.className = "fa fa-star-o";
        }
        if (getCookie("lesson-" + data.lessons[i].id) == "PERFECT") {
            document.getElementById("lessonButton" + i).lastElementChild.style.visibility = "visible";
        }
        if (data.lessons[i].items.length == 0) {
            document.getElementById("lessonButton" + i).setAttribute("data-status", "empty");
            document.getElementById("lessonButton" + i).style.filter = "grayscale(100%)";
            document.getElementById("lessonButton" + i).lastElementChild.style.visibility = "visible";
            document.getElementById("lessonButton" + i).lastElementChild.className = "fa fa-wrench";
        }
        if (data.lessons[i].startDate != "undefined") {
            sDate = Date.parse(data.lessons[i].startDate);
            if (sDate > Date.now()) {
                document.getElementById("lessonButton" + i).setAttribute("data-status", "locked");
                document.getElementById("lessonButton" + i).style.filter = "grayscale(100%)";
                document.getElementById("lessonButton" + i).lastElementChild.style.visibility = "visible";
                document.getElementById("lessonButton" + i).lastElementChild.className = "fa fa-lock";
            }
        }
    }
}

function clickLesson(lesson) {
    index = Number(lesson.getAttribute("data-index"));
    status = lesson.getAttribute("data-status");
    if (status == "go") {
        loadLessonNr(index);
    } else if (status == "empty") {
        document.getElementById("mainMenuModalInfo").innerHTML = "Lektionen " + data.lessons[index].name + " innehåller inget material än.<br>Ha tålamod. Vi jobbar på det.";
        document.getElementById("mainMenuModal").style.display = "block";
    } else if (status == "locked") {
        document.getElementById("mainMenuModalInfo").innerHTML = "Lektionen " + data.lessons[index].name + " är låst.<br>Den blir tillgänglig:<br>" + data.lessons[index].startDate + "<br>Vi ses då!";
        document.getElementById("mainMenuModal").style.display = "block";
    }
}

function hideMainMenuModal() {
    document.getElementById("mainMenuModal").style.display = "none";
}

function loadLessonNr(lessonNumber) {
    errorsInLesson = 0;
    activeLesson = data.lessons[lessonNumber].name;
    activeLessonID = data.lessons[lessonNumber].id;
    console.log(activeLesson);
    document.getElementById("lessonsMenuBackground").style.display = "none";
    sentences = data.lessons[lessonNumber].items;
    sentences = sentences.sort(() => Math.random() - 0.5);
    numberOfSentences = sentences.length;
    document.getElementById("progress").style.width = "10%";
    sentenceNr = 0;
    loadWord(sentences[sentenceNr]);
}

function loadWord(arr) {
    document.getElementById("modal").style.display = "none";
    document.getElementById("type1Top").style.display = "none";
    document.getElementById("type1Bottom").style.display = "none";
    document.getElementById("type2Main").style.display = "none";
    if (arr["type"] == "1") loadWordType1(arr);
    if (arr["type"] == "2") loadWordType2(arr);
}

function loadWordType1(arr) {
    document.getElementById("type1Top").style.display = "block";
    document.getElementById("type1Bottom").style.display = "block";
    words = arr["words"].split(" ").concat(arr["extraWords"].split(" "));
    words = words.sort(() => Math.random() - 0.5);
    correctSentence = arr["words"];
    document.getElementById("svenskMening").innerText = arr["sentence"];
    bot = document.getElementById("bottom");
    bot.innerHTML = "";
    for (i = 0; i < words.length; i++) {
        bot.innerHTML += "<div class='visibleWord' data-number='" + i + "' data-used='0' onclick='clicked(this);'>" + words[i] + "</div>";
    }
    chosenWords = [];
    update();
}

function loadWordType2(arr) {
    document.getElementById("type2Main").style.display = "block";
    document.getElementById("type2Word").innerText = arr["sentence"];
    words = arr["words"].split(" ").concat(arr["extraWords"].split(" "));
    words = words.sort(() => Math.random() - 0.5);
    console.log(words);
    words = words.sort(() => Math.random() - 0.5);
    correctSentence = arr["words"];
    document.getElementById("type2Word").innerText = arr["sentence"];
    document.getElementById("type2BoxContainer").innerHTML = "";
    for (i = 0; i < words.length; i++) {
        document.getElementById("type2BoxContainer").innerHTML += "<div onclick='optionClick(this);' class='optionBox'>" + words[i] + "</div>";
    }
}

function optionClick(word) {
    if (word.innerText == correctSentence) {
        word.style.color = "green";
        word.style.filter =  "drop-shadow(0 0 1vh green)";
        document.getElementById("progress").style.width = 10 + ((sentenceNr + 1) / numberOfSentences) * 90 + "%";
        document.getElementById("modal").style.display = "block";
        document.getElementById("lessonFinishedButton").style.display = "none";
        document.getElementById("nextWordButton").style.display = "none";
        if (sentenceNr + 1 == numberOfSentences) {
            lessonFinished();
        } else {
            document.getElementById("nextWordButton").style.display = "block";
        }
    } else {
        errorsInLesson++;
        word.style.color = "darkred";
        word.style.filter =  "drop-shadow(0 0 1vh darkred)";
    }
}

function lessonFinished() {
    document.getElementById("lessonFinishedButton").style.display = "block";
    if (errorsInLesson == 0) {
        setCookie("lesson-" + activeLessonID, "PERFECT", 365);
        console.log("Perfect score");
    } else {
        if(getCookie("lesson-" + activeLessonID) != "PERFECT")setCookie("lesson-" + activeLessonID, "DONE", 365);
    }

}

function clicked(word) {
    if (word.getAttribute("data-used") == "0") {
        word.setAttribute("data-used", "1");
        nr = word.getAttribute("data-number");
        chosenWords.push(nr);
        update();
    }
}

function removeWord(word) {
    chosenWords.splice(Number(word.getAttribute("data-index")), 1);
    document.getElementById("bottom").children[Number(word.getAttribute("data-number"))].setAttribute("data-used", "0");

    update();
}

function check() {
    if (chosenWords.length > 0) {
        str = "";
        for (i = 0; i < chosenWords.length; i++) {
            str += words[chosenWords[i]] + " ";
        }
        console.log(str);
        if (correctSentence == str.trim()) {
            console.log("CORRECT");
            document.getElementById("progress").style.width = 10 + ((sentenceNr + 1) / numberOfSentences) * 90 + "%";
            document.getElementById("modal").style.display = "block";
            document.getElementById("lessonFinishedButton").style.display = "none";
            document.getElementById("nextWordButton").style.display = "none";
            if (sentenceNr + 1 == numberOfSentences) {
                lessonFinished();
            } else {
                document.getElementById("nextWordButton").style.display = "block";
            }
        } else {
            console.log("FALSE");
            errorsInLesson++;
            document.getElementById("fel").style.display = "block";
            setTimeout(hideFel, 2000);
        }
    }
}

function hideFel() {
    document.getElementById("fel").style.display = "none";
}

function nextWord() {
    document.getElementById("modal").style.display = "none";
    sentenceNr++;
    loadWord(sentences[sentenceNr]);
}

function update() {
    c = document.getElementById("bottom").children;
    for (i = 0; i < c.length; i++) {
        if (c[i].getAttribute("data-used") == "0") {
            c[i].className = "visibleWord";
        } else {
            c[i].className = "invisibleWord";
        }
    }
    document.getElementById("output").innerHTML = "";
    for (i = 0; i < chosenWords.length; i++) {
        aNr = Number(chosenWords[i]);
        aStr = words[aNr];
        document.getElementById("output").innerHTML += "<div class='visibleWord' data-index='" + i + "' data-number='" + aNr + "' data-used='0' onclick='removeWord(this);'>" + aStr + "</div>";
    }
    if (chosenWords.length == 0) {
        document.getElementById("checkButton").className = "inactiveButton";
    } else {
        document.getElementById("checkButton").className = "activeButton";
    }
}

function showSettings() {
    document.getElementById("settingsModal").style.display = "block";
}

function hideSettings() {
    document.getElementById("settingsModal").style.display = "none";
}