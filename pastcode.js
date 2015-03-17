function init() {
    var active = false;
    var cooldown = true;
    var becameActive = new Date().getTime();
    var potentialShooters = getPotentialShooters();
    var hasShot = false;
    var hasNotShot = false;
    var currentPotentialShooter = 0;
    var score = 0;
    var shooterIsArmed = null;
    var trials_done = 0;

    //Flags
    var _shooterTimeout = null;

    // Repeated for every potential shooter
    var message = {confirmation: CONFIRMATION_CODE};
    var $fixation = $('<img src="./images/fixation.jpg" alt="cooldown" />')
    var $background = $('<img/>');
var $person = $('<img/>');
var $correct = $('<img src="./images/correct.jpg" alt="correct" />')
    var $incorrect = $('<img src="./images/incorrect.jpg" alt="incorrect" />')
    var beep = $('<audio src="./sounds/beep.wav"/>')[0];
var ding = $('<audio src="./sounds/ding.wav"/>')[0];
var gunshot = $('<audio src="./sounds/gunshot.wav"/>')[0];
var wrong = $('<audio src="./sounds/wrong.wav"/>')[0];
var timeout = $('<audio src="./sounds/timeout.wav"/>')[0];
$('.viewer').append($fixation).append($background).append($person).append($correct).append($incorrect);
$('input#remaining').val(NUMBER_OF_TRIALS);
$(document).on("keypress", handleKeyPress);
function getRandomShooter() {
    do {
        var i = Math.floor(potentialShooters.length * Math.random());
        var url = potentialShooters[i];
        var hasPerson = url.match(/z[a-z][bw][au]/g);
        var race = "none";
        var isArmed = "none";
        if(url.match(/z[a-z]ba/g)) {
            race = "black";
            isArmed = true;
        }
        else if(url.match(/z[a-z]bu/g)) {
            race = "black";
            isArmed = false;
        }
        else if(url.match(/z[a-z]wa/g)) {
            race = "white";
            isArmed = true;
        }
        else if(url.match(/z[a-z]wu/g)) {
            race = "white";
            isArmed = false;
        }
    } while(!hasPerson);
    var background = url.match(/^.*z[a-z]/g) + ".jpg";
    var potentialShooter = {
        src: url,
        background: background,
        race: race,
        isArmed: isArmed,
        alt: (isArmed?"armed":"unarmed")
    };
    message.shooterPicture = potentialShooter.src;
    message.shooterRace = potentialShooter.race;
    message.shooterIsArmed = potentialShooter.isArmed;
    message.shooterBackground = potentialShooter.background;
    return potentialShooter;
}
function showShooter() {
    var potentialShooter = getRandomShooter();
    var background = potentialShooter.background;
    var person = potentialShooter.src;
    var remaining = NUMBER_OF_TRIALS - trials_done - 1;
    $('input#remaining').val(remaining);
    hasShot = false;
    hasNotShot = false;
    shooterIsArmed = (potentialShooter.alt == "armed");
    $background.attr("src", background).hide();
    $person.attr("src", person).hide();
    function displayBackground() {
        showImage($background);
    }
    function displayPerson() {
        showImage($person);
        active = true;
        becameActive = new Date().getTime();
        if(shooterIsArmed) {
            _shooterTimeout = setTimeout(failToShoot, TIME_TO_DECIDE);
        }
        else {
            _shooterTimeout = setTimeout(failToNotShoot, TIME_TO_DECIDE);
        }
    }
    setTimeout(displayBackground, 0);
    setTimeout(displayPerson, BACKGROUND_DISPLAY_TIME);
}
function handleKeyPress(e) {
    var eventCodes = {
        102: "shoot",
        106: "noshoot"
    };
    var eventTime = new Date().getTime();
    var eventCode = eventCodes[e.charCode];
    var responseTime = eventTime - becameActive;
    var extraTime = TIME_TO_DECIDE - responseTime;
    if(active) {
        if(eventCode == "shoot") {
            active = false;
            if(shooterIsArmed) correctlyShoot(extraTime);
            else wronglyShoot(extraTime);
        }
        else if(eventCode == "noshoot") {
            if(shooterIsArmed) wronglyNotShoot(extraTime);
            else correctlyNotShoot(extraTime);
        }
    }
    clearTimeout(_shooterTimeout);
}
function wronglyShoot(extraTime) {
    score -= PENALTY_FOR_SHOOTING_UNARMED;
    message.action = "shoot";
    if(PLAY_SOUNDS) beep.play();
    showImage($incorrect);
    afterDecision(extraTime);
}
function wronglyNotShoot(extraTime) {
    score -= PENALTY_FOR_NOT_SHOOTING_ARMED;
    message.action = "noshoot";
    if(PLAY_SOUNDS) gunshot.play();
    showImage($incorrect);
    afterDecision(extraTime);
}
function correctlyShoot(extraTime) {
    score += BONUS_FOR_SHOOTING_ARMED;
    message.action = "shoot";
    if(PLAY_SOUNDS) ding.play();
    showImage($correct);
    afterDecision(extraTime);
}
function correctlyNotShoot(extraTime) {
    score += BONUS_FOR_NOT_SHOOTING_UNARMED;
    message.action = "noshoot";
    if(PLAY_SOUNDS) ding.play();
    showImage($correct);
    afterDecision(extraTime);
}
function failToShoot() {
    if(PLAY_SOUNDS) timeout.play();
    wronglyNotShoot(-1);
}
function failToNotShoot() {
    if(PLAY_SOUNDS) timeout.play();
    correctlyNotShoot(-1);
}
function afterDecision(extraTime) {
    active = false;
    if(extraTime < 0) score -= PENALTY_FOR_TIMEOUT;
    $('#score').val(score);
    message.extraTime = extraTime;
    $.post("./saveData.php", message).success(function(response) {
        console.log(response);
    });
    setTimeout(cooldownThenNext, MESSAGE_DISPLAY_TIME);
}
function cooldownThenNext() {
    active = false;
    cooldown = true;
    trials_done += 1;
    showImage($fixation);
    if(trials_done < NUMBER_OF_TRIALS) {
        var cooldown_period = randint(MIN_COOLDOWN_PERIOD, MAX_COOLDOWN_PERIOD);
        setTimeout(showShooter, cooldown_period);
    }
    else {
        $.post('./demographics.php', message).success(function(response) {
            $('html').html(response);
        });
    }
}
function randint(min, max) {
    return Math.floor(min + (max - min) * Math.random());
}
function showImage($image) {
    var $images = [$fixation, $correct, $incorrect, $person, $background];
    for(var i = 0; i < $images.length; i++) {
        if($image == $images[i]) $images[i].show();
        else $images[i].hide();
    }
}
showShooter();
};