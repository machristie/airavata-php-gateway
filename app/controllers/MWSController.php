<?php

class MWSController extends BaseController
{
    public function getJobStatus($machine_name) {
        // TODO: pick the base URL based on the $machine_name, currently hardcoded for bigred2
        $curl_request = curl_init("http://gw67.iu.xsede.org:8080/mws/rest/jobs?api-version=2&fields=name,states.state");
        curl_setopt($curl_request, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($curl_request, CURLOPT_USERPWD, "mwsadmin:mws@1admin");
        curl_setopt($curl_request, CURLOPT_RETURNTRANSFER, true);
        $result = curl_exec($curl_request);
        curl_close($curl_request);

        $response = Response::make($result, 200);
        $response->header('Content-Type', 'application/json');
        return $response;
    }
}

?>