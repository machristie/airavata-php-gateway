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

package org.apache.airavata.workflow.model.component.registry;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import org.apache.airavata.common.exception.AiravataConfigurationException;
import org.apache.airavata.common.registry.api.exception.RegistryException;
import org.apache.airavata.commons.gfac.type.ServiceDescription;
import org.apache.airavata.registry.api.AiravataRegistry2;
import org.apache.airavata.registry.api.AiravataRegistryConnectionDataProvider;
import org.apache.airavata.registry.api.AiravataRegistryFactory;
import org.apache.airavata.registry.api.AiravataUser;
import org.apache.airavata.registry.api.Gateway;
import org.apache.airavata.registry.api.util.RegistryConstants;
import org.apache.airavata.registry.api.util.WebServiceUtil;
import org.apache.airavata.workflow.model.component.ComponentReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class JCRComponentRegistry extends ComponentRegistry {

    private static final Logger log = LoggerFactory.getLogger(JCRComponentRegistry.class);
    private static final String NAME = "Application Services";
    public static final String REPOSITORY_PROPERTIES = "repository.properties";

    private AiravataRegistry2 registry;

    public JCRComponentRegistry(String username, String password) throws RegistryException {
        String gatewayName=null;
        AiravataRegistryConnectionDataProvider provider = AiravataRegistryFactory.getRegistryConnectionDataProvider();
		if (provider==null){
	        URL configURL = this.getClass().getClassLoader().getResource(REPOSITORY_PROPERTIES);
	        if(configURL != null){
		        try {
			        Properties properties = new Properties();
		            properties.load(configURL.openStream());
		            if (username==null){
			            if(properties.get(RegistryConstants.KEY_DEFAULT_REGISTRY_USER) != null){
			                username = (String)properties.get(RegistryConstants.KEY_DEFAULT_REGISTRY_USER);
			            }
		            }
		            gatewayName = (String)properties.get(RegistryConstants.KEY_DEFAULT_GATEWAY_ID);
		        } catch (MalformedURLException e) {
		            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
		        } catch (IOException e) {
		            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
		        }
	        }
        }else{
        	if (username==null){
				username=provider.getValue(RegistryConstants.KEY_DEFAULT_REGISTRY_USER).toString();
            }
        	gatewayName = provider.getValue(RegistryConstants.KEY_DEFAULT_GATEWAY_ID).toString();
        }
        if (username==null){
        	username="admin";	
        }
        if (gatewayName==null){
        	gatewayName="default";	
        }
        try {
			this.registry = AiravataRegistryFactory.getRegistry(new Gateway(gatewayName),
                    new AiravataUser(username));
        } catch (AiravataConfigurationException e) {
            log.error("Error initializing AiravataRegistry2");
        }

    }

    static {
        registerUserManagers();
    }

    /**
     * to manually trigger user manager registrations
     */
    private static void registerUserManagers() {
        try {
            Class.forName("org.apache.airavata.xbaya.component.registry.jackrabbit.user.JackRabbitUserManagerWrap");
        } catch (ClassNotFoundException e) {
            // error in registering user managers
        }
    }

    /**
     * @see org.apache.airavata.workflow.model.component.registry.ComponentRegistry#getComponentReferenceList()
     */
    @Override
    public List<ComponentReference> getComponentReferenceList() {
        List<ComponentReference> tree = new ArrayList<ComponentReference>();
        try {
            List<ServiceDescription> services = this.registry.getServiceDescriptors();
            for (ServiceDescription serviceDescription : services) {
                String serviceName = serviceDescription.getType().getName();
                JCRComponentReference jcr = new JCRComponentReference(serviceName,
                        WebServiceUtil.getWSDL(serviceDescription));
                tree.add(jcr);
            }
        } catch (RegistryException e) {
            log.error(e.getMessage(), e);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
		}

        return tree;
    }

    /**
     * @see org.apache.airavata.workflow.model.component.registry.ComponentRegistry#getName()
     */
    @Override
    public String getName() {
        return NAME;
    }

//    public String saveDeploymentDescription(String service, String host, ApplicationDeploymentDescription app) {
//        // deploy the service on host
//        registry.deployServiceOnHost(service, host);
//
//        // save deployment description
//        return registry.saveDeploymentDescription(service, host, app);
//    }

    public AiravataRegistry2 getRegistry() {
        return registry;
    }
}