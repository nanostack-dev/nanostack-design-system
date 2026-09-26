# Third-party foundations

This system follows the component anatomy, semantic token conventions and source ownership model of [shadcn/ui](https://github.com/shadcn-ui/ui) (MIT, Copyright shadcn), and uses [Base UI](https://github.com/mui/base-ui) (MIT, Copyright MUI).

Nanostack's closed styling API intentionally differs from shadcn's usual `className` and `render` customization. Component implementations and CSS are authored here; reviewed shadcn registry references and official documentation are recorded in `docs/research.md`. Runtime dependencies retain their own licenses.

## React Flow base stylesheet

`src/styles/graph-engine.css` adapts the base geometry CSS from `@xyflow/react` 12.12.0 by scoping its selectors to GraphCanvas.

```text
MIT License

Copyright (c) 2019-2025 webkid GmbH

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
