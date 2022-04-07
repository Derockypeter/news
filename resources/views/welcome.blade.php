<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>chig'OZie CHUKWU - Systems Developer/Data Scientist</title>
        <link rel="icon" href="{{ asset('img/ozLogo.png') }}">
        <!-- Fonts -->
        
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">

        <link href="{{ asset('css/materialize.min.css') }}" rel="stylesheet"/>
        <link href="https://cdn.materialdesignicons.com/4.5.95/css/materialdesignicons.min.css" rel="stylesheet">
        <link rel="stylesheet" href="{{ asset('fonts/material-icons.css') }}">        
        <link rel="stylesheet" href="{{ asset('css/gozie.css') }}">
    </head>
    <body>
        <div id="mainView">
        </div>
        

        <script src="/js/app.js"></script>
        <script src="{{ asset('./js/jquery-3.0.0.min.js') }}"></script>
        <script src="{{ asset('./js/materialize.min.js') }}"></script>
        <script>
            //initiaize materialcss JS modules
            M.AutoInit();

        </script>
    </body>
</html>
