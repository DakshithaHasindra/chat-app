package com.dakshitha.hasindra.web.api;

import com.dakshitha.hasindra.web.to.MessageTO;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Vector;

@RestController
@RequestMapping("/api/v1/messages")
@CrossOrigin
@Validated
public class MessagesHttpController {
    List<MessageTO> messageList = new Vector<>();

    public List<MessageTO> getMessageList(){
        return messageList;
    }

    @GetMapping
    public List<MessageTO> getAllMessages(){
    return messageList;
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(consumes = "application/json", produces = "application/json")
    public MessageTO saveMessage(@RequestBody @Valid MessageTO message){
        messageList.add(message);
        return message;
    }
}
