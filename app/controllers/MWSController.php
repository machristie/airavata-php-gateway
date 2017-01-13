<?php

class MWSController extends BaseController
{
    public function getJobStatus($machine_name) {
        $base_url = $this->getMachineBaseUrl($machine_name);
        $curl_request = curl_init($base_url . "jobs?api-version=2&fields=name,states.state");
        curl_setopt($curl_request, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($curl_request, CURLOPT_USERPWD, "mwsadmin:mws@1admin");
        curl_setopt($curl_request, CURLOPT_RETURNTRANSFER, true);
        $result = curl_exec($curl_request);
        curl_close($curl_request);

        $response = Response::make($result, 200);
        $response->header('Content-Type', 'application/json');
        return $response;
    }
    
    private function getMachineBaseUrl($machine_name) {
        if ($machine_name == "bigred2") {
            return "http://gw67.iu.xsede.org:8080/mws/rest/";
        } elseif ($machine_name == "karst") {
            return "http://gw87.iu.xsede.org:8081/mws/rest/";
        }
    }
}

?>