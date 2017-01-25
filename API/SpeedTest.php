<?php

namespace Modules\SpeedTest\API;

use Lightning\Tools\Configuration;
use Lightning\Tools\Mailer;
use Lightning\Tools\Output;
use Lightning\Tools\Performance;
use Lightning\Tools\Request;
use Lightning\View\API;

class SpeedTest extends API {
    public function getPing() {
        echo json_encode(['time' => Performance::getRunningTime() * 1000]);
        exit;
    }

    public function postUpload() {
        echo json_encode(['time' => Performance::getRunningTime() * 1000]);
        exit;
    }

    public function getDownload() {
        $size = Request::get('size', Request::TYPE_INT);
        // Create 1kb;
        $data = str_repeat('x', 1024);
        // Create 1MB;
        $data = str_repeat($data, 1024);
        // Output the data.
        Output::disableBuffering(false);
        Output::setContentType('raw/data');
        for ($i = 0; $i < $size; $i++) {
            echo $data;
        }
        exit;
    }

    public function postReport() {
        $mailer = new Mailer();
        $mailer->subject('Speed Test Complete');
        $mailer->message(
            'IP Address: ' . Request::getIP() . "<br><br>" .
            "<code>" . json_encode(Request::get('report', Request::TYPE_ASSOC_ARRAY), JSON_PRETTY_PRINT) . "</code>"
        );
        $mailer->to(current(Configuration::get('contact.to')));
        $mailer->send();
        return Output::SUCCESS;
    }
}
