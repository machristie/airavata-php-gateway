/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

package org.apache.airavata.xbaya.component.registry;

import java.util.List;

import org.apache.airavata.workflow.model.component.Component;
import org.apache.airavata.workflow.model.component.ComponentException;
import org.apache.airavata.workflow.model.component.ws.WSComponent;
import org.apache.airavata.workflow.model.component.ws.WSComponentFactory;

public class JCRComponentReference extends ComponentReference {

    private String wsdl;

    private List<WSComponent> components;

    public JCRComponentReference(String name, String wsdl) {
        super(name);
        this.wsdl = wsdl;
    }

    /**
     * @throws ComponentException
     * @throws ComponentRegistryException
     * @see org.apache.airavata.xbaya.component.registry.ComponentReference#getComponent()
     */
    @Override
    @Deprecated
    public Component getComponent() throws ComponentException, ComponentRegistryException {
        return getComponents().get(0);
    }

    /**
     * @see org.apache.airavata.xbaya.component.registry.ComponentReference#getComponents()
     */
    @Override
    public List<WSComponent> getComponents() throws ComponentRegistryException, ComponentException {
        if (this.components == null) {
            this.components = WSComponentFactory.createComponents(wsdl);
        }
        return this.components;
    }
}