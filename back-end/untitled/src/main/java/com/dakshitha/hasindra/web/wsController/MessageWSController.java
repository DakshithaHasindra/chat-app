package com.dakshitha.hasindra.web.wsController;

import com.dakshitha.hasindra.web.api.MessagesHttpController;
import com.dakshitha.hasindra.web.to.MessageTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import javax.validation.ConstraintViolation;
import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.Vector;

public class MessageWSController extends TextWebSocketHandler {

    private List<WebSocketSession> currentSessionList = new Vector<>();

    @Autowired
    private MessagesHttpController messagesHttpController;

    @Autowired
    private LocalValidatorFactoryBean validatorFactoryBean;

    @Autowired
    private ObjectMapper mapper;

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        System.out.println("Awa");
//        Todo:
        try {
            Set<ConstraintViolation<MessageTO>> validate = validatorFactoryBean.getValidator().validate(mapper.readValue(message.getPayload(),MessageTO.class));
            if(!validate.isEmpty()){
                session.sendMessage(new TextMessage("Invalid request"));
                return;
            }
            MessageTO messageTO = mapper.readValue(message.getPayload(), MessageTO.class);
            messageTO.setMessage(messageTO.getEmail()+" : "+messageTO.getMessage());

            messagesHttpController.getMessageList().add(messageTO);
            currentSessionList.forEach((ses)->{
                try {
                    if(ses.equals(session)) {
                    ses.sendMessage(new TextMessage(message.getPayload()));
                    }else {
                        ses.sendMessage(new TextMessage(mapper.writeValueAsString(messageTO)));
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            });

        } catch (IOException e) {
            session.sendMessage(new TextMessage("Error Occurred"));
            e.printStackTrace();
        }
//        currentSessionList.forEach((ses)->{
//            try {
//                ses.sendMessage(new TextMessage(message.getPayload()));
//            } catch (IOException e) {
//                e.printStackTrace();
//            }
//        });

    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        //        Todo:
//        session.sendMessage(new TextMessage());
        currentSessionList.add(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        currentSessionList.remove(session);
    }
}
