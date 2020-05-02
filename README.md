# UAG

**Universal API Gateway**

> This project is part of [Univ UC](https://github.com/univuc).

## Features

UAG is an API entry point for Univ UC services.    
It supports both REST API and slack command.

### Authentication

Authentication is a generic thing. It is separated from domain.    
UAG takes this part for other services.
Every incoming request(but `login` or `register`) should have a valid JWT signed by `UAS`.

### Re-route

UAG forwards a request to a proper service.

### Transform

For some clients, like slack, their requests should be transformed or newly created to fit in the service's REST API.    


