<?php
include ('_php/??');

$images = ("images");
?>

<html>
<head>

<script type='text/javascript'>
//initialise data database
<?php
$data = json_encode($images);
echo "var data_js = ". $data . ";\n";
?>
</script>

<link rel="icon" href="_resources/favicon.ico">
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link href="_css/index.css" rel="stylesheet" type="text/css" />
<script type='text/javascript' src="_js/XXX.js"></script>

<title>Worms</title>
<meta name="description" content="" />
<meta name="keywords" content="" />
<meta name="author" content="" />
<meta http-equiv="content-type" content="text/html;charset=UTF-8" />

</head>

<body onresize="getSize()" onload="getSize()">

<div id="header">
	<?php include 'menu_items.php'; ?>
</div>

<div id="content">

</div>

<div id="footer">

</div>

</body>
</html>
