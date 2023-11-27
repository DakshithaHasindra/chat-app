package com.dakshitha.hasindra.web.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/messages")
public class MessagesHttpController {

    @GetMapping
    public void getAllMessages(){

    }


    @PostMapping
    public void saveMessage(){

    }
}
