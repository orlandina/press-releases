# TODO: Fix this as soon as press has a separate location block in jigsaw
sed -Ei 's/(\(auto\|trucks\|caravaning\|coches\|voiture)/\1\|press/' /etc/nginx/conf.d/main.conf
sed -Ei 's/proxy_pass https:\/\/\$seo_pages;/proxy_pass http:\/\/press-releases:9000;/' /etc/nginx/conf.d/main.conf
sed -Ei 's/\/assets\/opt-pages/\/assets\/press/' /etc/nginx/conf.d/main.conf
sed -Ei "s/proxy_connect_timeout.+;$/proxy_connect_timeout 5s;/" /etc/nginx/nginx.conf
sed -Ei "s/proxy_send_timeout.+;$/proxy_send_timeout 5s;/" /etc/nginx/nginx.conf
sed -Ei "s/proxy_read_timeout.+;$/proxy_read_timeout 5s;/" /etc/nginx/nginx.conf
sed -Ei "s/(location ~ \^\/\(classified-detail.*)/\1\n    proxy_set_header Host www.autoscout24.de;/" /etc/nginx/conf.d/main.conf
/usr/sbin/nginx -s reload
