module.exports = (componentName, component) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Atomic Generator React</title>
  <link href="../../../assets/css/main.css" type="text/css" rel="stylesheet">
  <style type="text/css">
  .atomic-pattern-lib {
    font-family: sans-serif;
  }
  .component-raw-output  xmp {
    white-space: pre-wrap;
    padding: 10px;
    background-color: #eee;
    margin: 0;
    margin-bottom: 30px;
  }

  .component-raw-output h4 {
    margin-bottom: 0;
    margin-top: 30px;
  }
  </style>
</head>
<body>
  <header class="atomic-pattern-lib">
    <h3>${componentName}</h3>
  </header>

  ${component}

  <script src="../../../assets/js/main.js"></script>
</body>
</html>
`;
