export function BaiDuMap() {
  return new Promise(function(resolve, reject) {
    window.init = function() {
      resolve(window.BMap)
    }
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'http://api.map.baidu.com/api?v=2.0&ak=rG1uiOAnvcbjkVqvrP9RyiqO&callback=init'
    script.onerror = reject
    document.head.appendChild(script)
  })
}
