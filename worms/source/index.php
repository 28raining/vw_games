<?php
//would contain server call and authentification to the database / if we use.
include ('_php/??');
//call php function that generates a data array / call from server in this case / from previous work
$images = ("images");
?>

<html>
<head>

<script type='text/javascript'>
//initialise data database / json / helps to get the php into javascript array / onload of the page / if we use the google realtime database might be different call /
//please go to www.cretuvadim.ro -> to see an implementation of how this works and what it does, check the head. You'll see that the server is called only on page load -> i'm quite proud of this implementation :D
<?php
$data = json_encode($images);
echo "var data_js = ". $data . ";\n";
?>
</script>

<link rel="icon" href="_resources/favicon.ico">
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link href="_css/index.css" rel="stylesheet" type="text/css" />
<script type='text/javascript' src="_js/XXX.js"></script>

<!-- will be filled properly for good google indexing, still missing the google analytics and the google verificator-->
<title>Worms</title>
<meta name="description" content="" />
<meta name="keywords" content="" />
<meta name="author" content="" />
<meta http-equiv="content-type" content="text/html;charset=UTF-8" />

</head>
<!-- function to get the current width/height of window and generate local variables for scalable calculation -->
<body onresize="getSize()" onload="getSize()">

<!-- separate into includes, makes it neater to call, the includes are executed on the server-->
<div id="header">
	<?php include 'menu.php'; ?>
</div>

<div id="content">

</div>

<div id="footer">
	<?php include 'footer.php'; ?>
</div>

</body>
</html>
