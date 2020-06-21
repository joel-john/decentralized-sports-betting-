package org.glassfish.jersey.archetypes.GameResultsAPI;

import org.json.simple.JSONObject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;


/**
 * Root resource (exposed at "myresource" path)
 */
@Path("myresource")
public class MyResource {

    /**
     * Method handling HTTP GET requests. The returned object will be sent
     * to the client as "text/plain" media type.
     *
     * @return String that will be returned as a text/plain response.
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getIt() {
    	JSONObject jsonObject = new JSONObject();
    	jsonObject.put("game1", createJSONObjectForGame("Foo", "Bar", true));
    	jsonObject.put("game2", createJSONObjectForGame("Foo", "ABC", false));
    	jsonObject.put("game3", createJSONObjectForGame("ABC", "Bar", true));
    	return jsonObject.toJSONString();
    }
    
    private JSONObject createJSONObjectForGame(String team1, String team2, boolean team1won) {
    	JSONObject obj = new JSONObject();
    	obj.put("team1", team1);
    	obj.put("team2", team2);
    	obj.put("team1won", team1won);
    	return obj;
    }
}
