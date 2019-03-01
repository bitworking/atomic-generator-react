module.exports = (componentHtmlPath, componentString, navigationString) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Atomic Generator React</title>
    <style type="text/css">
    body {
      margin: 0;
      font-family: sans-serif;
      font-size: 16px;
    }

    *, ::before, ::after {
      box-sizing: border-box;
    }

    .component-raw-output  xmp {
      white-space: pre-wrap;
      padding: 10px;
      background-color: #eee;
      margin: 0;
    }

    .flex {
      display: flex;
      min-height: 100vh;
    }

    .flex > * {
      flex: 1;
    }

    .flex-row {
      flex-direction: row;
    }

    .flex-col {
      flex-direction: column;
    }

    .flex-basis-25 {
      flex-basis: 25%;
    }

    .flex-basis-75 {
      flex-basis: 75%;
    }

    .flex-grow {
      flex-grow: 1;
    }

    .navi {
      border-right: 2px solid #999;
    }

    .code {
      border-top: 2px solid #999;
      max-height: 25%;
    }

    .container-code {
      height: 100%;
      overflow: auto;
    }

    iframe {
      border: 0;
      width: 100%;
      height: 100%;
    }

    </style>
  </head>
  <body>
    <div class="container">
      <div class="flex">
        <div class="flex-basis-25 navi">
          ${navigationString}
        </div>
        <div class="flex-basis-75 flex flex-col">
          <div class="flex-basis-75">
            <iframe src="${componentHtmlPath}"></iframe>
          </div>
          <div class="flex-basis-25 code">
            <div class="container-code">
              <div class="component-raw-output">
                <xmp>${componentString}</xmp>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
`;
