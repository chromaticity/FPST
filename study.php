<?
    if($_POST["confirm"] != "really") {
        header("Location: ./consent.html");
    }
?>
<!DOCTYPE HTML>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Shooter Task -- Study</title>
        <link rel="stylesheet" type="text/css" href="./study.css" />
        <script src="http://code.jquery.com/jquery.js"></script>
        <script src="./q.js"></script>
        <script src="study.js"></script>
    </head>
    <body>
        <h1>Shooter Task</h1>
        <div class="wrapper">
            <div class="game hidden">
                <div class="remaining hidden">
                    <label for="remaining">Remaining:</label>
                    <input disabled id="remaining" value="" />
                </div>
                <div class="score">
                    <label for="score">Score:</label>
                    <input disabled id="score" value="0" />
                </div>
                <div class="viewer"></div>
            </div>
        </div>
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
