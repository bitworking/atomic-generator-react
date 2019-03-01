module.exports = body => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Atomic Generator React</title>
  <link href="../assets/css/main.css" type="text/css" rel="stylesheet">
</head>
<body>
  ${body}
  <script src="../assets/js/main.js"></script>
</body>
</html>
`;
