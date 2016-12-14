<?php

return [
    'routes' => [
        'static' => [
            'speed-test' => 'Modules\\SpeedTest\\Pages\\SpeedTest',
            'api/speed-test' => 'Modules\\SpeedTest\\API\\SpeedTest',
        ]
    ],
    'js' => [
        // Module Name
        'SpeedTest' => [
            // Source file => Dest file
            'SpeedTest.js' => 'SpeedTest.min.js',
        ]
    ]
];
