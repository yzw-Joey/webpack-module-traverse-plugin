# webpack-module-traverse-plugin

`packages：RegExp 需要收集的模块`

`ignore：RegExp 默认值/node_modules/, /^(?!.*\.(jsx?|tsx?)$)/`

`info: 收集结果信息`

| 属性    | Description | example | default |
| --------- | ----------- | --------- | --------- |
| packages：RegExp[]    | target packages pattern      | /antd/ | - |
| ignore：RegExp[] | ignore packages pattern    | /node_modules/ | [/node_modules/, /^(?!.*\.(jsx?\|tsx?)$)/ ] 
| info: Map |  - | - | - |