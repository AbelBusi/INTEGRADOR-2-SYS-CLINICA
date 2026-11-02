package com.salud.consultorio.impl;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;

@Service
public class ReferenciaServicio {

    @PersistenceContext
    private EntityManager entityManager;

    public <T> T getRef(Class<T> tClass, Integer id){

        return entityManager.getReference(tClass,id);

    }

}