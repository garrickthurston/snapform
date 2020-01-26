To Run Migrations:

- cd tools
- rh.exe -c {local_connection_string} -f ..\scripts -cds ..\scripts\custom_db_create.sql --silent true --vf .\_buildInfo.xml --env LOCAL -t`
