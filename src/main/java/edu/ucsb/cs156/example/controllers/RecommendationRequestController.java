// package edu.ucsb.cs156.example.controllers;

// import edu.ucsb.cs156.example.entities.RecommendationRequest;
// import edu.ucsb.cs156.example.errors.EntityNotFoundException;
// import edu.ucsb.cs156.example.repositories.RecommendationRequestRepository;

// import io.swagger.v3.oas.annotations.Operation;
// import io.swagger.v3.oas.annotations.Parameter;
// import org.springframework.web.bind.annotation.RequestBody;
// import io.swagger.v3.oas.annotations.tags.Tag;
// import lombok.extern.slf4j.Slf4j;

// import com.fasterxml.jackson.core.JsonProcessingException;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.format.annotation.DateTimeFormat;
// import org.springframework.security.access.prepost.PreAuthorize;
// import org.springframework.web.bind.annotation.DeleteMapping;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.PutMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.RestController;

// import java.time.LocalDateTime;

// import javax.validation.Valid;

// @Tag(name = "RecommendationRequest")
// @RequestMapping("/api/recommendationrequests")
// @RestController
// @Slf4j
// public class RecommendationRequestController extends ApiController {

//     @Autowired
//     private RecommendationRequestRepository recommendationRequestRepository;
//     @Operation(summary= "List all the recommendation requests")
//     @PreAuthorize("hasRole('ROLE_USER')")
//     @GetMapping("/all")

//     public Iterable<RecommendationRequest> allRequests() {
//         Iterable<RecommendationRequest> requests = recommendationRequestRepository.findAll();
//         return requests;
//     }

//     @Operation(summary= "Create a new recommendation request")
//     @PreAuthorize("hasRole('ROLE_ADMIN')")
//     @PostMapping("/post")

//     public RecommendationRequest postRequest(
//             @Parameter(name="requesterEmail") @RequestParam String requesterEmail,
//             @Parameter(name="professorEmail") @RequestParam String professorEmail,
//             @Parameter(name="explanation") @RequestParam String explanation,
//             @Parameter(name="DateRequest", description = "iso = DateTimeFormat.ISO.DATE_TIME") @RequestParam("DateRequest") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime DateRequest,
//             @Parameter(name="DateNeeded", description = "iso = DateTimeFormat.ISO.DATE_TIME") @RequestParam("DateNeeded") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime DateNeeded,
//             @Parameter(name="done") @RequestParam boolean done)
//             throws JsonProcessingException 
//      {
//         // For an explanation of @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
//         // See: https://www.baeldung.com/spring-date-parameters

//         log.info("dateRequested={}", DateRequest);
//         //log.info("dateNeeded={}", dateNeeded);

//         RecommendationRequest reqst = new RecommendationRequest();
//         reqst.setRequesterEmail(requesterEmail);
//         reqst.setProfessorEmail(professorEmail);
//         reqst.setExplanation(explanation);
//         reqst.setDateRequest(DateRequest);
//         reqst.setDateNeeded(DateNeeded);
//         reqst.setDone(done);

//         RecommendationRequest savedRequest = recommendationRequestRepository.save(reqst);
//         return savedRequest;
//     }


//     @Operation(summary= "Get a single recommendation request")
//     @PreAuthorize("hasRole('ROLE_USER')")
//     @GetMapping("")
//     public RecommendationRequest getById(
//             @Parameter(name="id") @RequestParam Long id) {
//         RecommendationRequest request = recommendationRequestRepository.findById(id)
//                 .orElseThrow(() -> new EntityNotFoundException(RecommendationRequest.class, id));

//         return request;
//     }


//     @Operation(summary= "Delete a recommendation request")
//     @PreAuthorize("hasRole('ROLE_ADMIN')")
//     @DeleteMapping("")
//     public Object deleteRecommendationRequest(
//             @Parameter(name="id") @RequestParam Long id) {
//         RecommendationRequest delRequest = recommendationRequestRepository.findById(id)
//                 .orElseThrow(() -> new EntityNotFoundException(RecommendationRequest.class, id));

//         recommendationRequestRepository.delete(delRequest);
//         return genericMessage("Recommendation request with id %s deleted".formatted(id));
//     }

//     @Operation(summary= "Update a single recommendation request")
//     @PreAuthorize("hasRole('ROLE_ADMIN')")
//     @PutMapping("") 
//     public RecommendationRequest updateRecommendationRequest(
//         @Parameter(name="id") @RequestParam Long id,
//         @RequestBody @Valid RecommendationRequest incoming) {
        
//         //log.info("incoming={}", incoming.toString());

//         RecommendationRequest reqst = recommendationRequestRepository.findById(id)
//                 .orElseThrow(() -> new EntityNotFoundException(RecommendationRequest.class, id));

//         // reqst.setRequesterEmail(incoming.getRequesterEmail());
//         // reqst.setProfessorEmail(incoming.getProfessorEmail());
//         // reqst.setExplanation(incoming.getExplanation());
//         // reqst.setDateRequest(incoming.getDateRequest());
//         // reqst.setDateNeeded(incoming.getDateNeeded());
//         // reqst.setDone(incoming.getDone());

//         recommendationRequestRepository.save(reqst);

//         return reqst;
//     }
// }
package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.RecommendationRequest;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.RecommendationRequestRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.web.bind.annotation.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

import javax.validation.Valid;

@Tag(name = "RecommendationRequest")
@RequestMapping("/api/RecommendationRequest")
@RestController
@Slf4j
public class RecommendationRequestController extends ApiController {

    @Autowired
    RecommendationRequestRepository recReqRepository;

    @Operation(summary= "List all recommendation requests")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<RecommendationRequest> allRecommendationRequests() {
        Iterable<RecommendationRequest> requests = recReqRepository.findAll();
        return requests;
    }

    @Operation(summary= "Get a single recommendation request")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public RecommendationRequest getById(
            @Parameter(name="id") @RequestParam Long id) {
        RecommendationRequest request = recReqRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(RecommendationRequest.class, id));

        return request;
    }

    @Operation(summary= "Create a new recommendation request")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public RecommendationRequest postRecommendationRequest(
            @Parameter(name="requesterEmail") @RequestParam String requesterEmail,
            @Parameter(name="professorEmail") @RequestParam String professorEmail,
            @Parameter(name="explanation") @RequestParam String explanation,
            @Parameter(name="dateRequested", description="in iso format, e.g. YYYY-mm-ddTHH:MM:SS; see https://en.wikipedia.org/wiki/ISO_8601") @RequestParam("dateRequested") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateRequested,
            @Parameter(name="dateNeeded", description="in iso format, e.g. YYYY-mm-ddTHH:MM:SS; see https://en.wikipedia.org/wiki/ISO_8601") @RequestParam("dateNeeded") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateNeeded,
            @Parameter(name="done") @RequestParam boolean done)
            throws JsonProcessingException {

        // For an explanation of @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        // See: https://www.baeldung.com/spring-date-parameters

        log.info("dateRequested={}", dateRequested);
        log.info("dateNeeded={}", dateNeeded);

        RecommendationRequest rq = new RecommendationRequest();
        rq.setRequesterEmail(requesterEmail);
        rq.setProfessorEmail(professorEmail);
        rq.setExplanation(explanation);
        rq.setDateRequested(dateRequested);
        rq.setDateNeeded(dateNeeded);
        rq.setDone(done);

        RecommendationRequest savedRequest = recReqRepository.save(rq);
        return savedRequest;
    }

    @Operation(summary= "Update a single recommendation request")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("") 
    public RecommendationRequest updateRecommendationRequest(
        @Parameter(name="id") @RequestParam Long id,
        @RequestBody @Valid RecommendationRequest incoming) {
        
        log.info("incoming={}", incoming.toString());

        RecommendationRequest rq = recReqRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(RecommendationRequest.class, id));

        rq.setRequesterEmail(incoming.getRequesterEmail());
        rq.setProfessorEmail(incoming.getProfessorEmail());
        rq.setExplanation(incoming.getExplanation());
        rq.setDateRequested(incoming.getDateRequested());
        rq.setDateNeeded(incoming.getDateNeeded());
        // rq.setDone(incoming.getDone());

        recReqRepository.save(rq);

        return rq;
    }

    @Operation(summary= "Delete a RecommendationRequest")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteRecommendationRequest(
            @Parameter(name="id") @RequestParam Long id) {
        RecommendationRequest rq = recReqRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(RecommendationRequest.class, id));

        recReqRepository.delete(rq);
        return genericMessage("RecommendationRequest with id %s deleted".formatted(id));
    }
}
