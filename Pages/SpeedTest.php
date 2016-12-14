<?php

namespace Modules\SpeedTest\Pages;

use Lightning\View\JS;
use Lightning\View\Page;

class SpeedTest extends Page {

    protected $page = ['speed-test', 'SpeedTest'];

    public function hasAccess() {
        return true;
    }

    public function get() {
        JS::addResource('SpeedTest.js', 'SpeedTest');
    }
}
