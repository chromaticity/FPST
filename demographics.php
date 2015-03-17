<html>
    <head>
        <meta charset="utf-8" />
        <title>Shooter Task -- Post-Completion Questionnaire</title>
        <link rel="stylesheet" type="text/css" href="./demographics.css" />
    </head>
    <body>
        <h1>Shooter Task</h1>
        <h2>Post-Completion Questionnaire</h2>
        <form method="post" action="./debrief.php">
            <div class="gender question">
                <label for="gender">What is your gender?</label><br />
                <input type="radio" id="gender-female" name="gender" value="female" /><label for="gender-female">Female.</label><br />
                <input type="radio" id="gender-male" name="gender" value="male" /><label for="gender-male">Male.</label><br />
            </div>
            <div class="zipcode question">
                <label for="zipcode">What is your zip code?</label><br />
                <input id="zipcode" name="zipcode" />
            </div>
            <div class="age question">
                <label for="age">What is your age?</label><br />
                <input id="age" name="age" />
            </div>
            <div class="borninus question">
                <label for="borninus">Were you born in the US?</label><br />
                <input type="radio" id="borninus-yes" name="borninus" value="yes" /><label for="borninus-yes">Yes.</label><br />
                <input type="radio" id="borninus-no" name="borninus" value="no" /><label for="borninus-no">No.</label><br />
            </div>
            <div class="ethnicity question">
                <label for="ethnicity">What is your ethnicity? (check all that apply)</label><br />
                <input type="checkbox" id="ethnicity-african-american" name="ethnicity" value="african-american" /><label for="ethnicity-african-american">African-American.</label><br />
                <input type="checkbox" id="ethnicity-asian-american" name="ethnicity" value="asian-american" /><label for="ethnicity-asian-american">Asian-American.</label><br />
                <input type="checkbox" id="ethnicity-hispanic" name="ethnicity" value="hispanic" /><label for="ethnicity-hispanic">Hispanic.</label><br />
                <input type="checkbox" id="ethnicity-native-american" name="ethnicity" value="native-american" /><label for="ethnicity-native-american">Native-American.</label><br />
                <input type="checkbox" id="ethnicity-caucasian" name="ethnicity" value="caucasian" /><label for="ethnicity-caucasian">Caucasian.</label><br />
                <input type="checkbox" id="ethnicity-other" name="ethnicity" value="other" /><label for="ethnicity-other">Other.</label><br />
            </div>
            <div class="politics question">
                <label for="politics">On a scale of 1 to 7, where 1 is more conservative and 7 is more liberal, where would you place yourself</label><br />
                <input type="range" min="1" max="7" step="0.1" name="politics" id="politics" />
            </div>
            <input type="hidden" name="confirmation" value="<? echo $_POST["confirmation"];?>" />
            <button type="submit">Submit</button>
        </form>
        <script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-54262822-1', 'auto');
  ga('send', 'pageview');

        </script>
    </body>
</html>
