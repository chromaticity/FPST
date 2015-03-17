<?
include "./config.php";
$mysqli = new mysqli(MYSQL_HOSTNAME, MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_DATABASE);
$parameters = array(
    "Confirmation"    => mysqli_real_escape_string($mysqli, $_POST["confirmation"]),
    "ShooterPicture"              => mysqli_real_escape_string($mysqli, $_POST["shooterPicture"]),
    "ShooterBackground"           => mysqli_real_escape_string($mysqli, $_POST["shooterBackground"]),
    "ShooterRace"                 => mysqli_real_escape_string($mysqli, $_POST["shooterRace"]),
    "ShooterIsArmed"              => mysqli_real_escape_string($mysqli, $_POST["shooterIsArmed"]),
    "Action"                      => mysqli_real_escape_string($mysqli, $_POST["action"]),
    "ExtraTime"                   => intval($_POST["extraTime"])
);
$query = "INSERT INTO responses(";
foreach($parameters as $name => $value) {
    $query .= "`{$name}`, ";
}
$query = mb_substr($query, 0, -2) . ") VALUES (";
foreach($parameters as $name => $value) {
    if(is_string($value)) {
        $query .= "'{$value}', ";
    } else {
        $query .= "{$value}, ";
    }
}
$query = mb_substr($query, 0, -2) . ");";
mysqli_query($mysqli, $query);
echo mysqli_error($mysqli);
