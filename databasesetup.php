<?php
/*
 * I have written this little program so it makes the MySQL database for you, that will contain the tables that will
 * hold information about the participants of the study, and the responses during the trials.
 */


include "./config.php";


$con=mysqli_connect(MYSQL_HOSTNAME, MYSQL_USERNAME, MYSQL_PASSWORD);





/* Checks to see if the database "fpst_user_info" exists. If it does not, this program will create one. If it
 * does exist, it will delete the existing database and make a fresh new one. This is useful if you want to re-use this
 * program again for trials on other people, and you no longer want the data that is stored on your database from
 * previous trials.
 */
mysqli_select_db($con,"fpst_user_info");
$sql="DROP DATABASE `fpst_user_info`";
if (mysqli_query($con,$sql)) {
    echo "Database 'fpst_user_info' deleted successfully... Making a new empty database. ";
} else {
    echo " Table fpst_user_info does not exist... Making a new one. ";
};

// Check connection if it could be established to the database.
if (mysqli_connect_errno()) {
    echo "<br>";
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
    echo "</br>";
};

// Create database for the information of the participants, and their responses.
$sql="CREATE DATABASE fpst_user_info";
if (mysqli_query($con,$sql)) {
    echo "<br>";
    echo "Database 'fpst_user_info' created successfully.  ";
    echo "</br>";
} else {
    echo "Error creating database: fpst_user_info." . mysqli_error($con);
};

// Create table in the database that stores information of the participant.
mysqli_select_db($con,"fpst_user_info");
$sql="CREATE TABLE participant_info (confirmation VARCHAR(30),gender CHAR(10),borninus CHAR(10),ethnicity CHAR(20),politics INT(5),age INT(5),zipcode INT(6))";

// Execute query
if (mysqli_query($con,$sql)) {
    echo "  Table 'participant_info' created successfully.";
} else {
    echo "Error creating table: participant_info." . mysqli_error($con);
};

// Create table in the database that stores information of the participant.
mysqli_select_db($con,"fpst_user_info");
$sql="CREATE TABLE responses (confirmation VARCHAR(30),shooterPicture CHAR(30),shooterBackground CHAR(30),shooterRace CHAR(30),shooterIsArmed VARCHAR(30),action VARCHAR(30),extraTime INT(10))";

// Execute query
if (mysqli_query($con,$sql)) {
    echo "  Table 'responses' created successfully.";
} else {
    echo "Error creating table: responses." . mysqli_error($con);
};
?>