import $ from 'jquery'
import k_report from 'k-report'
import k_logging from 'k-logging'
import '../Css/index.scss'

try{
  k_logging.setOptions(
      {
        app_key: 'xlpc',
        open_level : ['info','warn','error'],
        method: ['','', ''],
        switch_listener: true
      }
)
}catch(e){
     console.log(e)
  console.log('k_loggin error')
}
//alert(1)

try{
  k_report.setOptions(
    {
    'debug': false,
    'loadtime': {
        'url': 'http://k-inner-report.404mzk.com/v1/Creator_Loadtime_Controller/insert',
    },
    'network': {
        'url': 'http://k-inner-report.404mzk.com/v1/Creator_Network_Controller/insert',
        'timeout': 1000,
    },
    'error': {
        'url': 'http://k-inner-report.404mzk.com/v1/Creator_Error_Controller/insert',
    }}
)
}catch(e){
    console.log(e)
  console.log('k_report error')
}