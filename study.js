var MIN_COOLDOWN_PERIOD = 500;
var MAX_COOLDOWN_PERIOD = 3000;
var MIN_BACKGROUND_DISPLAY_TIME = 500;
var MAX_BACKGROUND_DISPLAY_TIME = 2000;
var FEEDBACK_DISPLAY_TIME = 1500;
var TIME_TO_DECIDE = 850;
var PENALTY_FOR_SHOOTING_UNARMED = 20;
var PENALTY_FOR_NOT_SHOOTING_ARMED  = 40;
var BONUS_FOR_SHOOTING_ARMED = 10;
var BONUS_FOR_NOT_SHOOTING_UNARMED = 5;
var PENALTY_FOR_TIMEOUT = 10;
var NUMBER_OF_PRACTICE_ROUNDS = 16;
var NUMBER_OF_TRIALS = 100;
var PLAY_SOUNDS = true;
var SEND_TO_SERVER = true;
var MIN_BACKGROUND_IMAGES = 2;
var MAX_BACKGROUND_IMAGES = 5;
function getConfirmationCode() {
    var cc = "";
    for(var i = 0; i < 0x20; i++) {
        cc += Math.floor(Math.random() * 16).toString(16);
    }
    return cc;
}
var CONFIRMATION_CODE = getConfirmationCode();

var score = 0;
var beep = $('<audio src="./sounds/beep.wav"/>')[0];
var ding = $('<audio src="./sounds/ding.wav"/>')[0];
var gunshot = $('<audio src="./sounds/gunshot.wav"/>')[0];
var wrong = $('<audio src="./sounds/wrong.wav"/>')[0];
var timeout = $('<audio src="./sounds/timeout.wav"/>')[0];

function log(x) {
    console.log("log", x);
    return Q(x);
}
    function randint(min, max) {
        return Math.floor(Math.random() * (1 + max - min) + min);
    }
function now() {
    return new Date().getTime();
}
function showScore() {
    $('#score').val(score);
}

function getReady() {
    var d = Q.defer();
    var p = d.promise;
    $(document).ready(function() {
        d.resolve();
    });
    return p;
};
function getImageLocations() {
    var d = Q.defer();
    var p = d.promise;
    $.get('./imageLocations.txt').then(function(response) {
        var imageLocations = response.split('\n');
        d.resolve(imageLocations);
    });
    return p;
}
var ready = getReady();
var imageLocations = getImageLocations();

var introDone          = ready.then(doIntro);
var practiceRoundsDone = introDone.then(doPracticeRounds);
var interludeDone      = practiceRoundsDone.then(doInterlude);
var trialsDone         = interludeDone.then(doTrials);
trialsDone.then(collectDemographics);


function doIntro() {
    var d = Q.defer();
    var p = d.promise;
    function giveInstructions() {
        var d = Q.defer();
        var p = d.promise;
        var $instructions = $('<div class="instructions"/>');
        var $head = $('<h2/>');
        var $body = $('<div/>');
        function prepare() {
            var d = Q.defer();
            var p = d.promise;
            $instructions.append($head);
            $instructions.append($body);
            $('.wrapper').append($instructions);
            d.resolve();
            return p;
        }
        function giveInstructions1() {
            var d1 = Q.defer();
            var p = d1.promise;
            $head.html("Instructions (page 1 of 3)");
            $body.html("");
            $body.append('<p>In this videogame, your task is to SHOOT any person who is holding a gun (the bad guys) by pressing <span class="key">J</span> on the keyboard.</p>');
            $body.append('<p>If a person is holding something other than a gun, he is a good guy, and you should NOT SHOOT him by pressing the <span class="key">F</span> key on the keyboard</p>');
            $body.append('<p>Press the <span class="key">SPACE BAR</span> for more instructions.</p>');
            $(document).keypress(function(e) {
                // Find out what key the user pressed.
                var keyChar = String.fromCharCode(e.which);
                if(keyChar === " ") {
                    d1.resolve();
                }
            });
            return p;
        }
        function giveInstructions2() {
            var d2 = Q.defer();
            var p = d2.promise;
            $head.html("Instructions (page 2 of 3)");
            $body.html("");
            $body.append('<p>Please keep your index or middle fingers on the <span class="key">J</span> (shoot) and <span class="key">F</span> (don\'t shoot) keys.</p>');
            $body.append('<p>You will have less than a second to make each decision.</p>');
            $body.append('<p>You will receive points based on your performance.</p>');
            $body.append('<p>The first round of the game is for practice.</p>');
            $body.append('<p>Press the <span class="key">SPACE BAR</span> for more instructions.</p>');
            $(document).keypress(function(e) {
                // Find out what key the user pressed.
                var keyChar = String.fromCharCode(e.which);
                if(keyChar === " ") {
                    d2.resolve();
                }
            });
            return p;
        }
        function giveInstructions3() {
            var d3 = Q.defer();
            var p = d3.promise;
            $head.html("Instructions (page 3 of 3)");
            $body.html("");
            $body.append('<p>Please place your index or middle fingers on the <span class="key">J</span> (shoot) and <span class="key">F</span> (don\'t shoot) keys now.</p>');
            $body.append('<p>...</p>');
            setTimeout(d3.resolve, 3000);
            return p;
        }
        function cleanUp() {
            var d = Q.defer();
            var p = d.promise;
            $instructions.remove();
            d.resolve();
            return p;
        }
        prepare()
            .then(giveInstructions1)
            .then(giveInstructions2)
            .then(giveInstructions3)
            .then(cleanUp)
            .then(d.resolve);
        return p;
    }

    function doCountdown() {
        var d = Q.defer();
        var p = d.promise;
        var $head = $('<h2/>').html("Practice trials will begin in");
        var $countdownScreen = $('<div class="countdown"/>');
        function prepare() {
            var d = Q.defer();
            var p = d.promise;
            $('.wrapper').append($head);
            $('.wrapper').append($countdownScreen);
            d.resolve();
            return p;
        }
        function c3() {
            var d = Q.defer();
            var p = d.promise;
            $countdownScreen.html('3');
            setTimeout(d.resolve, 1000);
            return p;
        }
        function c2() {
            var d = Q.defer();
            var p = d.promise;
            $countdownScreen.html('2');
            setTimeout(d.resolve, 1000);
            return p;
        }
        function c1() {
            var d = Q.defer();
            var p = d.promise;
            $countdownScreen.html('1');
            setTimeout(d.resolve, 1000);
            return p;
        }
        function cleanUp() {
            $head.remove();
            $countdownScreen.remove();
        }
        prepare()
            .then(c3)
            .then(c2)
            .then(c1)
            .then(cleanUp)
            .then(d.resolve);
        return p;
    }
    ready
        .then(giveInstructions)
        .then(doCountdown)
        .then(d.resolve);
    return p;
}

function doInterlude() {
    score = 0;
    function giveInstructions() {
        var d = Q.defer();
        var p = d.promise;
        var $instructions = $('<div class="instructions"/>');
        var $head = $('<h2/>');
        var $body = $('<div/>');
        function prepare() {
            var d = Q.defer();
            var p = d.promise;
            $instructions.append($head);
            $instructions.append($body);
            $('.game').hide();
            $('.wrapper').append($instructions);
            d.resolve();
            return p;
        }
        function giveInstructions1() {
            var d1 = Q.defer();
            var p = d1.promise;
            $head.html("Practice trials completed.");
            $body.html("");
            $body.append('<p>You have now completed the practice trials.</p>');
            $body.append('<p>Your score will now be reset for the test trials.</p>');
            $body.append('<p>Please place your index or middle fingers on the <span class="key">J</span> (shoot) and <span class="key">F</span> (don\'t shoot) keys now.</p>');
            $body.append('<p>Press the <span class="key">SPACE BAR</span></p>');
            $(document).keypress(function(e) {
                // Find out what key the user pressed.
                var keyChar = String.fromCharCode(e.which);
                if(keyChar === " ") {
                    d1.resolve();
                }
            });
            return p;
        }
        function cleanUp() {
            var d = Q.defer();
            var p = d.promise;
            $instructions.remove();
            d.resolve();
            return p;
        }
        prepare()
            .then(giveInstructions1)
            .then(cleanUp)
            .then(d.resolve);
        return p;
    }

    function doCountdown() {
        var d = Q.defer();
        var p = d.promise;
        var $head = $('<h2/>').html("Real trials will begin in");
        var $countdownScreen = $('<div class="countdown"/>');
        function prepare() {
            var d = Q.defer();
            var p = d.promise;
            $('.wrapper').append($head);
            $('.wrapper').append($countdownScreen);
            d.resolve();
            return p;
        }
        function c3() {
            var d = Q.defer();
            var p = d.promise;
            $countdownScreen.html('3');
            setTimeout(d.resolve, 1000);
            return p;
        }
        function c2() {
            var d = Q.defer();
            var p = d.promise;
            $countdownScreen.html('2');
            setTimeout(d.resolve, 1000);
            return p;
        }
        function c1() {
            var d = Q.defer();
            var p = d.promise;
            $countdownScreen.html('1');
            setTimeout(d.resolve, 1000);
            return p;
        }
        function cleanUp() {
            $head.remove();
            $countdownScreen.remove();
        }
        prepare()
            .then(c3)
            .then(c2)
            .then(c1)
            .then(cleanUp)
            .then(d.resolve);
        return p;
    }
    return giveInstructions().then(doCountdown);
}

function generateSequence(r, a) {
    /* Generates a sequence in the following format:
     * [
     *  {src: "./images/za.jpg", duration: 800, image: <img/>},
     *  {src: "./images/zj.jpg", duration: 600, image: <img/>},
     *  {src: "./images/zd.jpg", duration: 1000, image: <img/>},
     *  {src: "./images/zdwa94d1.jpg", duration: 850, image: <img/>}
     * ]
     * The number of background images shown will be from
     * MIN_BACKGROUND_IMAGES to MAX_BACKGROUND_IMAGES
     * and the backgrounds will be displayed for between
     * MIN_BACKGROUND_DISPLAY_TIME and MAX_BACKGROUND_DISPLAY_TIME.
     */
    var d = Q.defer();
    var p = d.promise;
    var sequence = [];
    var num_backgrounds = randint(MIN_BACKGROUND_IMAGES, MAX_BACKGROUND_IMAGES);
    function generate(imageLocations) {
        var d = Q.defer();
        var p = d.promise;
        var defers = [];
        var promises = [];
        for(var i = 0; i < num_backgrounds; i++) {
            var imageObj = {};
            imageObj.src = getRandomBackground(imageLocations);
            imageObj.duration = randint(MIN_BACKGROUND_DISPLAY_TIME, MAX_BACKGROUND_DISPLAY_TIME);
            // This will cause the image to be pulled from the server as soon as the sequence is created.
            sequence.push(imageObj);
        }
        var src = getRandomPerson(imageLocations, imageObj.src);
        var imageObj = {};
        imageObj.src = src;
        imageObj.duration = TIME_TO_DECIDE;
        sequence.push(imageObj);
        for(var i = 0; i < sequence.length; i++) {
            var imageObj = sequence[i];
            imageObj.image = new Image();
            imageObj.image.src = imageObj.src;
            defers[i] = Q.defer();
            promises[i] = defers[i].promise;
            (function closure(i) {
                // Closures are useful.
                imageObj.image.onload = function() {
                    defers[i].resolve();
                }
            })(i)
        }
        Q.all(promises).then(resolve);
        function resolve() {
            d.resolve(sequence);
        }
        return p;
    }
    function getRandomBackground(imageLocations) {
        var num_images = imageLocations.length;
        do {
            var imageUrl = imageLocations[randint(0, num_images - 1)]
        } while(typeFromImageUrl(imageUrl) !== "background");
        return imageUrl;
    }
    function getRandomPerson(imageLocations, backgroundSrc) {
        var bc = backgroundSrc.match(/\/z([a-z])\.jpg/)[1];
        if(!r) var race = randint(0, 1) ? 'b' : 'w';
        else var race = r;
        if(!a) var armed = randint(0, 1) ? 'a' : 'u';
        else var armed = a;
        var tester = new RegExp('\\\/z' + bc + race + armed + '[0-9a-z]+\\\.jpg');
        for(var i = 0; i < imageLocations.length; i++) {
            if(tester.test(imageLocations[i])) {
                return imageLocations[i];
            }
        }
    }
    function resolve(x) {
        d.resolve(x);
    }
    imageLocations.then(generate).then(resolve);
    return p;
}
function typeFromImageUrl(imageUrl) {
    if(imageUrl.match(/\/z[a-z]\.jpg$/g)) {
        return "background";
    }
    else if(imageUrl.match(/\/z[a-z][bw][au][0-9a-z]+\.jpg/g)) {
        return "shooter";
    }
    else {
        console.warn("unknown image type: ", JSON.stringify(imageUrl));
        return "unknown";
    }
}

function showBackgrounds(sequence) {
    var result = Q(sequence);
    $('.game').show();
    for(var i = 0; i < sequence.length - 1; i++) {
        var imageObj = sequence[i];
        var image = imageObj.image;
        var duration = imageObj.duration;
        (function closure(image, duration) {
            var f = function() {
                var d = Q.defer();
                var p = d.promise;
                showImage(image, duration).then(function() {
                    d.resolve(sequence);
                });
                return p;
            }
            result = result.then(f);
        })(image, duration)
    }
    function showImage(image, duration) {
        var d = Q.defer();
        var p = d.promise;
        $('.viewer').html('');
        $('.viewer').append(image);
        setTimeout(d.resolve, duration);
        return p;
    }
    return result;
}

function showShooter(sequence) {
    var d = Q.defer();
    var p = d.promise;
    $('.viewer').html('');
    $shooter = $(sequence.pop().image);
    $('.viewer').append($shooter);
    var src = $shooter.attr('src');
    var race, armed;
    if(src.match(/z[a-z]b[au]/g)) race = "black";
    else race = "white";
    if(src.match(/z[a-z][bw]a/g)) armed = true;
    else armed = false;
    d.resolve({race: race, armed: armed, src: src});
    return p;
}

function getResponse(shooter) {
    var d = Q.defer();
    var p = d.promise;
    var stimulusGiven = now();
    $(document).keypress(function(e) {
        var keyChar = String.fromCharCode(e.which);
        if(keyChar === "j") {
            shooter.response = "shoot";
            shooter.time = now() - stimulusGiven;
            d.resolve(shooter);
        }
        if(keyChar === "f") {
            shooter.response = "no shoot";
            shooter.time = now() - stimulusGiven;
            d.resolve(shooter);
        }
    });
    setTimeout(function() {
        shooter.response = "timeout";
        shooter.time = now() - stimulusGiven;
        d.resolve(shooter);
    }, TIME_TO_DECIDE);
    return p;
}

function saveResponse(response) {
    var data = {
        confirmation: CONFIRMATION_CODE,
        shooterPicture: response.src,
        shooterBackground: null,
        shooterRace: response.race,
        shooterIsArmed: response.armed,
        action: response.response,
        extraTime: TIME_TO_DECIDE - response.time
    }
    $.post('./saveData.php', data, log, log);
    return Q(response);
}

function showFeedback(result) {
    var d = Q.defer();
    var p = d.promise;
    $viewer = $('.viewer');
    $viewer.html('<br /><br /><br /><br /><br />');
    if(result.armed) {
        if(result.response === "shoot") {
            var message = "Nice shot";
            var dScore = BONUS_FOR_SHOOTING_ARMED;
        }
        else if(result.response === "timeout") {
            var message = "Out of time, you're dead";
            var dScore = -PENALTY_FOR_TIMEOUT;
            dScore -= PENALTY_FOR_NOT_SHOOTING_ARMED;
        }
        else {
            var message = "You're dead";
            var dScore = -PENALTY_FOR_NOT_SHOOTING_ARMED;
        }
    }
    else {
        if(result.response === "shoot") {
            var message = "You shot a good guy";
            var dScore = -PENALTY_FOR_SHOOTING_UNARMED;
        }
        else if(result.response === "timeout") {
            var message = "Out of time";
            var dScore = -PENALTY_FOR_TIMEOUT;
            dScore += BONUS_FOR_NOT_SHOOTING_UNARMED;
        }
        else {
            var message = "Good choice";
            var dScore = BONUS_FOR_NOT_SHOOTING_UNARMED;
        }
    }
    $viewer.append($('<p/>').html(message));
    var $dScore = $('<p class="dScore"/>');
    $viewer.append($dScore);
    if(dScore >= 0) {
        $dScore.html('+' + dScore + ' points');
    }
    else {
        $dScore.html('-' + (-dScore) + ' points');
    }
    score += dScore;
    $viewer.append($('<p/>').html('Current score: ' + score));
    showScore(score);
    setTimeout(d.resolve, FEEDBACK_DISPLAY_TIME);
    return p;
}

function showFixation() {
    /* Shows the fixation image for a time between
     * MIN_COOLDOWN_PERIOD and MAX_COOLDOWN_PERIOD
     */
    var d = Q.defer();
    var p = d.promise;
    var fixationImage = new Image();
    fixationImage.src = "./images/fixation.jpg";
    fixationImage.onload = function() {
        $('.viewer').html(fixationImage);
    }
    var cooldown = randint(MIN_COOLDOWN_PERIOD, MAX_COOLDOWN_PERIOD);
    setTimeout(d.resolve, cooldown);
    return p;
}

function doPracticeRounds() {
    var result = ready;
    /* Creates a randomly shuffled array called people that contains two letter
     * strings that represent race and whether or not that person is armed.
     * This ensures a balance of black and white and of armed and unarmed
     * people that the participants must decide whether or not to shoot.
     */
    var people = [];
    for(var i = 0; i < NUMBER_OF_PRACTICE_ROUNDS; i++) {
        var r = randint(0, people.length - 1);
        people[i] = people[r];
        people[r] = ((i/2|0)%2?'w':'b')+((i/1|0)%2?'a':'u');
    }
    var j = 0;
    function doPracticeRound() {
        var d = Q.defer();
        var p = d.promise;
        generateSequence(people[j][0], people[j][1])
            .then(showBackgrounds)
            .then(showShooter)
            .then(getResponse)
            .then(showFeedback)
            .then(showFixation)
            .then(d.resolve);
        j++;
        return p;
    }
    for(var i = 0; i < NUMBER_OF_PRACTICE_ROUNDS; i++) {
        result = result.then(doPracticeRound);
    }
    return result;
}

function doTrials() {
    var result = ready;
    /* Creates a randomly shuffled array called people that contains two letter
     * strings that represent race and whether or not that person is armed.
     * This ensures a balance of black and white and of armed and unarmed
     * people that the participants must decide whether or not to shoot.
     */
    var people = [];
    for(var i = 0; i < NUMBER_OF_TRIALS; i++) {
        var r = randint(0, people.length - 1);
        people[i] = people[r];
        people[r] = ((i/2|0)%2?'w':'b')+((i/1|0)%2?'a':'u');
    }
    var j = 0;
    function doTrial() {
        var d = Q.defer();
        var p = d.promise;
        generateSequence(people[j][0], people[j][1])
            .then(showBackgrounds)
            .then(showShooter)
            .then(getResponse)
            .then(saveResponse)
            .then(showFeedback)
            .then(showFixation)
            .then(d.resolve);
        j++;
        return p;
    }
    for(var i = 0; i < NUMBER_OF_TRIALS; i++) {
        result = result.then(doTrial);
    }
    return result;
}

function collectDemographics() {
    $.post('./demographics.php', {confirmation: CONFIRMATION_CODE}, function(response) {
        $('body').html(response);
    });
}

/*
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
*/
