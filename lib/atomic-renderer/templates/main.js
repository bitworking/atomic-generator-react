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

    *,
     ::before,
     ::after {
      box-sizing: border-box;
    }

    .component-raw-output xmp {
      white-space: pre-wrap;
      padding: 10px;
      margin: 0;
    }

    .flex {
      display: flex;
      min-height: 100vh;
    }

    .flex>* {
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
      overflow-y: auto;
      height: 100vh;
    }

    .code {
      border-top: 2px solid #999;
      max-height: 25%;
    }

    .container-code {
      height: 100%;
      overflow: auto;
    }

    .frame {

    }

    iframe {
      border: 0;
      width: 100%;
      height: 100%;
    }

    ul.list-tree {
      max-width: 400px;
      padding: 0.5em;
    }
    ul.list-tree ul {
      padding: 0;
    }

    ul.list-tree li {
      display: block;
      position: relative;
      vertical-align: top;
      font-size: 14px;
      line-height: 1.5em;
      padding: 0 1.3em;
      border-left: 1px solid steelblue;
      background: transparent;
      list-style-type: square;
      list-style-position: inside;
      overflow: visible;
    }
    ul.list-tree li.tree-directory:after {
      content: "";
      position: absolute;
      top: 0.6em;
      left: 0;
      height: 0.7em;
      width: 0.6em;
      opacity: 1;
    }
    ul.list-tree li:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: 1em;
      width: 1em;
      border-bottom: 1px solid steelblue;
    }
    ul.list-tree li:last-child {
      border-left: 0;
    }
    ul.list-tree li:last-child:before {
      border-left: 1px solid steelblue;
      background: transparent;
    }
    ul.list-tree a {
      color: midnightblue !important;
      font-weight: bold;
    }

    .controls {
      padding: 8px;
    }

    .controls a {
      color: midnightblue;
      font-size: 14px;
    }


  </style>
</head>

<body>
  <div class="container">
    <div class="flex">
      <div class="flex-basis-25 navi">
        <div class="controls">
          <a href="${componentHtmlPath}" target="_blank">Open in new window</a>
        </div>
        ${navigationString}
      </div>
      <div class="flex-basis-75 flex flex-col">
        <div class="flex-basis-75 frame">
          <iframe src="${componentHtmlPath}"></iframe>
        </div>
        <div class="flex-basis-25 code">
          <div class="container-code">
            <div class="component-raw-output">
              <xmp>
${componentString}
              </xmp>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;
