/+  *server, default-agent
/=  index
  /^  octs
  /;  as-octs:mimes:html
  /:  /===/app/bartinfo/index
  /|  /html/
      /~  ~
  ==
/=  tile-js
  /^  octs
  /;  as-octs:mimes:html
  /:  /===/app/bartinfo/js/tile
  /|  /js/
      /~  ~
  ==
/=  script
  /^  octs
  /;  as-octs:mimes:html
  /:  /===/app/bartinfo/js/index
  /|  /js/
      /~  ~
  ==
/=  style
  /^  octs
  /;  as-octs:mimes:html
  /:  /===/app/bartinfo/css/index
  /|  /css/
      /~  ~
  ==
/=  bartinfo-png
  /^  (map knot @)
  /:  /===/app/bartinfo/img  /_  /png/
::
|%
+$  card  card:agent:gall
--
^-  agent:gall
=<
  |_  bol=bowl:gall
  +*  this       .
      bartinfo-core  +>
      cc         ~(. bartinfo-core bol)
      def        ~(. (default-agent this %|) bol)
  ::
  ++  on-init
    ^-  (quip card _this)
    =/  launcha  [%launch-action !>([%add %bartinfo / '/~bartinfo/js/tile.js'])]
    :_  this
    :~  [%pass / %arvo %e %connect [~ /'~bartinfo'] %bartinfo]
        [%pass /bartinfo %agent [our.bol %launch] %poke launcha]
    ==
  ++  on-poke
    |=  [=mark =vase]
    ^-  (quip card _this)
    ?>  (team:title our.bol src.bol)
    ?+    mark  (on-poke:def mark vase)
        %handle-http-request
      =+  !<([eyre-id=@ta =inbound-request:eyre] vase)
      :_  this
      %+  give-simple-payload:app  eyre-id
      %+  require-authorization:app  inbound-request
      poke-handle-http-request:cc
    ::
    ==
  ::
  ++  on-watch
    |=  =path
    ^-  (quip card:agent:gall _this)
    ?:  ?=([%http-response *] path)
      `this
    ?.  =(/ path)
      (on-watch:def path)
    [[%give %fact ~ %json !>(*json)]~ this]
  ::
  ++  on-agent  on-agent:def
  ::
  ++  on-arvo
    |=  [=wire =sign-arvo]
    ^-  (quip card _this)
    ?.  ?=(%bound +<.sign-arvo)
      (on-arvo:def wire sign-arvo)
    [~ this]
  ::
  ++  on-save  on-save:def
  ++  on-load  on-load:def
  ++  on-leave  on-leave:def
  ++  on-peek   on-peek:def
  ++  on-fail   on-fail:def
  --
::
::
|_  bol=bowl:gall
::
:: request to http://api.bart.gov/api/stn.aspx?cmd=stns&key=Q5RQ-PUEB-999T-DWEI&json=y
:: get .root | .stations | .station for list of stations
++  poke-handle-http-request
  |=  =inbound-request:eyre
  ^-  simple-payload:http
  =+  url=(parse-request-line url.request.inbound-request)
  ?+  site.url  not-found:gen
      [%'~bartinfo' %css %index ~]  (css-response:gen style)
      [%'~bartinfo' %js %tile ~]    (js-response:gen tile-js)
      [%'~bartinfo' %js %tileman ~]    (js-response:gen tile-js)
      [%'~bartinfo' %js %index ~]   (js-response:gen script)
  ::
      [%'~bartinfo' %img @t *]
    =/  name=@t  i.t.t.site.url
    =/  img  (~(get by bartinfo-png) name)
    ?~  img
      not-found:gen
    (png-response:gen (as-octs:mimes:html u.img))
  ::
      [%'~bartinfo' *]  (html-response:gen index)
  ==
::
--
