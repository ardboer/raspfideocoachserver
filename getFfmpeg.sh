ps -ef | grep 'raspivid' | awk '
BEGIN { ORS = ""; print " [ "}
{ printf "%s{\"user\": \"%s\",  \"pid1\": \"%s\", \"procesname\": \"%s\",\"url\": \"%s\",\"filename\": \"%s\"}",
      separator, $1, $2, $8, $10, $13
  separator = ", "
}
END { print " ] " }';
